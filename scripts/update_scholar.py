#!/usr/bin/env python3
"""
抓取引用数据，生成 data/scholar.json 供主页读取。

数据源按优先级尝试：
  1. SerpApi Google Scholar（需环境变量 SERPAPI_KEY，最稳）
  2. Google Scholar 直抓（scholarly，可能被拦）
  3. Semantic Scholar 批量接口（按 DOI，免费无需密钥）
  4. Crossref is-referenced-by-count（兜底）

论文列表直接从 index.html 解析（data-doi + 标题），新增论文不用改本脚本。
"""

import json
import os
import re
import sys
import time
import html
import socket
import datetime
import urllib.request
import urllib.error

# 全局超时预算：任何一个数据源卡住就直接跳过，避免 GitHub Actions 挂死
socket.setdefaulttimeout(30)
START = time.time()
MAX_RUNTIME = float(os.environ.get("MAX_RUNTIME", "240"))


def out_of_time():
    return (time.time() - START) > MAX_RUNTIME

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
INDEX = os.path.join(ROOT, "index.html")
OUT = os.environ.get("OUT_PATH", os.path.join(ROOT, "data", "scholar.json"))
SCHOLAR_ID = os.environ.get("GOOGLE_SCHOLAR_ID", "9XxYjFYAAAAJ")
UA = {"User-Agent": "Mozilla/5.0 (compatible; homepage-citation-sync)"}


def norm(s):
    """标题归一化，用于跨数据源匹配。"""
    s = html.unescape(s or "").lower()
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s


def read_papers():
    """从 index.html 解析 (doi, title)。"""
    src = open(INDEX, encoding="utf-8").read()
    out = []
    for m in re.finditer(r'<li class="pub"[^>]*>(.*?)</li>', src, re.S):
        block = m.group(1)
        dm = re.search(r'data-doi="([^"]+)"', m.group(0))
        tm = re.search(r'class="p-title">(.*?)</div>', block, re.S)
        if not dm:
            continue
        title = re.sub(r"<[^>]+>", "", tm.group(1)) if tm else ""
        out.append((dm.group(1).strip(), norm(title), title.strip()))
    return out


def http_json(url, data=None, headers=None, timeout=60):
    req = urllib.request.Request(url, data=data)
    for k, v in (headers or UA).items():
        req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


# ---------------------------------------------------------------- 数据源
def from_serpapi(papers):
    key = os.environ.get("SERPAPI_KEY")
    if not key:
        return None
    base = ("https://serpapi.com/search.json?engine=google_scholar_author"
            "&author_id=%s&hl=en&num=20&api_key=%s" % (SCHOLAR_ID, key))
    total = h = i10 = None
    per = {}
    # 该接口每页最多 20 篇，翻页取全，避免论文变多后漏统计
    for start in (0, 20, 40, 60):
        if out_of_time():
            break
        url = base if start == 0 else base + "&start=%d" % start
        try:
            d = http_json(url)
        except Exception as e:
            sys.stderr.write("serpapi page start=%d failed: %r\n" % (start, e))
            break
        stats = (d.get("cited_by") or {}).get("table") or []
        for row in stats:
            c = (row.get("citations") or {})
            if c.get("all") is not None:
                total = c.get("all")
            if row.get("h_index"):
                h = row["h_index"].get("all", h)
            if row.get("i10_index"):
                i10 = row["i10_index"].get("all", i10)
        arts = d.get("articles") or []
        for art in arts:
            per[norm(art.get("title", ""))] = (art.get("cited_by") or {}).get("value", 0)
        if len(arts) < 20:
            break
    if total is None and not per:
        return None
    return {"source": "google-scholar(serpapi)", "citations": total,
            "hindex": h, "i10index": i10, "by_title": per}


def from_scholarly(papers):
    try:
        from scholarly import scholarly
    except Exception:
        return None
    try:
        scholarly.set_timeout(20)
    except Exception:
        pass
    for attempt in range(2):
        if out_of_time():
            sys.stderr.write("scholarly skipped: out of time budget\n")
            return None
        try:
            a = scholarly.search_author_id(SCHOLAR_ID)
            if not a:
                raise RuntimeError("author not found")
            a = scholarly.fill(a, sections=["basics", "indices", "publications"])
            per = {}
            for p in a.get("publications", []):
                per[norm((p.get("bib") or {}).get("title", ""))] = p.get("num_citations", 0)
            return {"source": "google-scholar", "citations": a.get("citedby"),
                    "hindex": a.get("hindex"), "i10index": a.get("i10index"),
                    "by_title": per}
        except Exception as e:
            sys.stderr.write("scholarly attempt %d failed: %r\n" % (attempt + 1, e))
            time.sleep(5 * (attempt + 1))
    return None


def from_semanticscholar(papers):
    dois = [d for d, _, _ in papers if d]
    if not dois:
        return None
    body = json.dumps({"ids": ["DOI:" + d for d in dois]}).encode()
    req = urllib.request.Request(
        "https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,citationCount",
        data=body)
    req.add_header("Content-Type", "application/json")
    req.add_header("User-Agent", UA["User-Agent"])
    for attempt in range(3):
        if out_of_time():
            sys.stderr.write('semantic scholar skipped: out of time budget\n')
            return None
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                arr = json.loads(r.read().decode("utf-8", "replace"))
            by_doi, by_title = {}, {}
            for d, item in zip(dois, arr):
                if not item:
                    continue
                c = item.get("citationCount")
                if c is None:
                    continue
                by_doi[d] = c
                by_title[norm(item.get("title", ""))] = c
            if not by_doi:
                return None
            return {"source": "semantic-scholar", "citations": sum(by_doi.values()),
                    "hindex": None, "i10index": None, "by_doi": by_doi, "by_title": by_title}
        except Exception as e:
            sys.stderr.write("semantic scholar attempt %d failed: %r\n" % (attempt + 1, e))
            time.sleep(10 * (attempt + 1))
    return None


def from_crossref(papers):
    by_doi = {}
    for doi, _, _ in papers:
        if out_of_time():
            break
        try:
            u = "https://api.crossref.org/works/" + urllib.parse.quote(doi)
            d = http_json(u)["message"]
            by_doi[doi] = d.get("is-referenced-by-count", 0)
        except Exception as e:
            sys.stderr.write("crossref %s failed: %r\n" % (doi, e))
        time.sleep(0.5)
    if not by_doi:
        return None
    return {"source": "crossref", "citations": sum(by_doi.values()),
            "hindex": None, "i10index": None, "by_doi": by_doi, "by_title": {}}


def load_baseline():
    """人工核实的 Google Scholar 权威数值。

    Google Scholar 没有官方 API，从 GitHub Actions 的服务器直连 scholar.google.com
    会被拦截，兜底源（Semantic Scholar）收录口径更窄、数字偏小。
    因此提供一份人工基线：抓不到 Scholar 时以它为准，保证主页数字与 Scholar 一致。
    """
    path = os.environ.get("BASELINE_PATH", os.path.join(HERE, "scholar-baseline.json"))
    if not os.path.exists(path):
        return None
    try:
        b = json.load(open(path, encoding="utf-8"))
    except Exception as e:
        sys.stderr.write("baseline 解析失败: %r\n" % (e,))
        return None
    if b.get("citations") is None:
        return None
    return b


def compute_hindex(counts):
    counts = sorted((c for c in counts if c), reverse=True)
    h = 0
    for i, c in enumerate(counts, 1):
        if c >= i:
            h = i
        else:
            break
    return h


def main():
    import urllib.parse  # noqa: F401  (used by crossref)
    papers = read_papers()
    print("[i] index.html 中解析到 %d 篇带 DOI 的论文" % len(papers))

    # 1) 先试真正的 Google Scholar 数据源
    result = None
    for fn in (from_serpapi, from_scholarly):
        if out_of_time():
            print("[!] 超出时间预算，停止尝试后续数据源")
            break
        try:
            r = fn(papers)
        except Exception as e:
            sys.stderr.write("%s failed: %r\n" % (fn.__name__, e))
            r = None
        if r:
            result = r
            print("[OK] 数据源: %s" % r["source"])
            break

    # 2) 抓不到 Scholar：优先用人工基线（数字与 Scholar 一致），否则退回兜底源
    if not result:
        fallback = None
        for fn in (from_semanticscholar, from_crossref):
            if out_of_time():
                break
            try:
                r = fn(papers)
            except Exception as e:
                sys.stderr.write("%s failed: %r\n" % (fn.__name__, e))
                r = None
            if r:
                fallback = r
                print("[i] 兜底数据源: %s（口径与 Google Scholar 不同）" % r["source"])
                break

        base = load_baseline()
        if base:
            result = {
                "source": "google-scholar(manual)",
                "citations": base.get("citations"),
                "hindex": base.get("hindex"),
                "i10index": base.get("i10index"),
                "by_doi": dict(base.get("papers") or {}),
                # 基线里没有的论文（新发表的）仍用兜底源按标题补上
                "by_title": (fallback or {}).get("by_title") or {},
            }
            print("[OK] 数据源: 人工基线（Google Scholar 实测值 %s/%s/%s）"
                  % (base.get("citations"), base.get("hindex"), base.get("i10index")))
            if not base.get("papers"):
                print("[!] 基线里没有逐篇数据")
        elif fallback:
            result = fallback
            print("[!] 无基线文件，只能使用兜底源，主页数字会小于 Google Scholar")
        else:
            print("[X] 所有数据源都失败，保留旧数据不动")
            return 1

    # 按 DOI 汇总每篇引用数
    per_doi = dict(result.get("by_doi") or {})
    by_title = result.get("by_title") or {}
    for doi, nkey, _ in papers:
        if doi in per_doi:
            continue
        if nkey in by_title:
            per_doi[doi] = by_title[nkey]

    total = result.get("citations")
    h = result.get("hindex")
    i10 = result.get("i10index")
    if h is None:
        h = compute_hindex(per_doi.values())
    if i10 is None:
        i10 = sum(1 for c in per_doi.values() if c >= 10)
    if total is None:
        total = sum(per_doi.values())

    # 读取旧值，防止抓错导致数字倒退
    old = {}
    if os.path.exists(OUT):
        try:
            old = json.load(open(OUT, encoding="utf-8"))
        except Exception:
            old = {}
    if old.get("citations") and total and total < old["citations"]:
        print("[!] 新总数 %s 小于旧值 %s，判定为抓取异常，放弃本次写入" % (total, old["citations"]))
        return 1

    data = {
        "updated": datetime.datetime.now(datetime.timezone.utc)
                           .strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": result["source"],
        "citations": total,
        "hindex": h,
        "i10index": i10,
        "papers": per_doi,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("[OK] 写入 %s" % OUT)
    print("    citations=%s h=%s i10=%s  论文数=%d" % (total, h, i10, len(per_doi)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
