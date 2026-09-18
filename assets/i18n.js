/* ===========================================================
   中英双语切换
   - 元素上加 data-i18n="key"（纯文本）或 data-i18n-html="key"（含标签）
   - 默认跟随浏览器语言，用户手动切换后记进 localStorage
   - 论文标题/作者/期刊保持英文，只翻译界面文案
   =========================================================== */

var I18N = {
  en: {
    role: 'Ph.D. Candidate in Software Engineering',
    affil1: 'School of Artificial Intelligence and Computer Science',
    affil2: 'Jiangnan University, Wuxi, Jiangsu, China',
    ct_email: 'E-mail', ct_tel: 'Tel',
    btn_cv: 'CV (PDF)', btn_inst: 'Institution Page',
    m_cit: 'Citations', m_h: 'h-index', m_i10: 'i10-index', m_pub: 'Publications',

    nav_about: 'About', nav_news: 'News', nav_edu: 'Education', nav_exp: 'Experience',
    nav_pub: 'Publications', nav_svc: 'Service', nav_award: 'Awards',
    lang_btn: '中文',

    h_about: 'About',
    about_p1: 'I received my B.Eng. degree in Internet of Things Engineering from Jinling Institute ' +
      'of Technology, Nanjing, China, in 2021. In the same year, I began my graduate studies at ' +
      'Jiangnan University, Wuxi, China, where I pursued a Master\'s degree in Computer Science ' +
      'before being admitted to the doctoral program. I am currently working toward my Ph.D. ' +
      'degree in Software Engineering at the Jiangsu Provincial Engineering Laboratory of Pattern ' +
      'Recognition and Computational Intelligence, Jiangnan University, under the supervision of ' +
      '<a href="https://scholar.google.com/citations?user=5IST34sAAAAJ&amp;hl=en" target="_blank" rel="noopener"><strong>Prof. Xiao-Jun Wu</strong></a> and ' +
      '<a href="https://www.surrey.ac.uk/people/josef-kittler" target="_blank" rel="noopener"><strong>Prof. Josef Kittler</strong></a>. From 2025 to 2026, ' +
      'I was a China Scholarship Council (CSC) sponsored joint-training Ph.D. student at the ' +
      '<strong>University of Surrey</strong>, United Kingdom, hosted by ' +
      '<strong>Prof. Josef Kittler</strong>.',
    about_p2: 'My research focuses on <strong>multimodal image fusion</strong>, with an emphasis on ' +
      'robustness in complex and adverse environments. These works address the pronounced ' +
      'performance degradation of existing methods when fusing cross-modal data under challenging ' +
      'conditions such as bad weather and misalignment. My expertise also covers low-level vision ' +
      'tasks (e.g., image registration and super-resolution) and efficient model deployment on ' +
      'edge devices.',
    about_p3: 'My publications appear in venues such as <em>IEEE Transactions on Multimedia</em> ' +
      '(TMM), <em>International Journal of Computer Vision</em> (IJCV), <em>Information Fusion</em>, ' +
      '<em>IEEE Transactions on Instrumentation and Measurement</em> (TIM), ' +
      '<em>ACM Transactions on Multimedia Computing, Communications, and Applications</em> (TOMM), ' +
      'CVPR, and ICPR.',
    chip1: 'Multimodal Image Fusion', chip2: 'Infrared–Visible Fusion',
    chip3: 'Image Registration', chip4: 'Diffusion Models', chip5: 'Transformers',
    chip6: 'CNNs', chip7: 'Saliency Detection', chip8: 'Adverse Weather Restoration',
    chip9: 'Efficient Deployment',

    h_news: 'News',
    news1: 'Two first-author papers published in <em>IEEE Transactions on Multimedia</em> and the <em>International Journal of Computer Vision</em>.',
    news2: 'Joined <strong>Bosch (China) Investment Ltd.</strong> (CR-RIX/AP) as a Strategic Intern on end-to-end autonomous driving.',
    news3: 'Awarded the <strong>CSC National Scholarship</strong> for joint Ph.D. training at the University of Surrey.',
    news4: '<em>DDBFusion</em> published in <em>Information Fusion</em> (SCI Q1 Top, IF 14.7).',
    news5: '<em>One Model for All</em> accepted at <strong>CVPR 2025</strong>.',

    h_edu: 'Education',
    edu1_t: 'Visiting Ph.D. Student (CSC Joint Training), Pattern Recognition',
    edu1_s: 'University of Surrey, Guildford, United Kingdom',
    edu2_t: 'Ph.D. in Software Engineering', edu2_s: 'Jiangnan University, Wuxi, China',
    edu3_t: 'M.S. in Computer Science', edu3_tag: 'transferred to Ph.D. programme',
    edu3_s: 'Jiangnan University, Wuxi, China',
    edu4_t: 'B.Eng. in Internet of Things Engineering',
    edu4_s: 'Jingling Institute of Technology, Nanjing, China',

    h_exp: 'Experience',
    exp1_t: 'Strategic Intern, Autonomous Driving', exp1_s: 'Bosch (China) Investment Ltd., China',
    exp1_b1: 'Pre-research on end-to-end autonomous driving algorithms.',
    exp1_b2: 'Optimised the perception backbone of <em>DiffusionDrive</em>; designed multi-scale BEV perception with a sparse refined feature-extraction strategy.',
    exp1_b3: 'Used a Vision Transformer to dynamically select key spatial features and Register Tokens for trajectory prediction, removing the computational redundancy of high-resolution feature fusion.',
    exp1_b4: 'Achieved a competitive PDMS score on the NAVSIM vision-only closed-loop benchmark while preserving real-time inference.',
    exp2_t: 'Deep Learning Framework Engineer', exp2_s: 'National Supercomputing Center, Wuxi, China',
    exp2_b1: 'Ported and optimised PyTorch operators onto an in-house AI chip in <em>C++/CUDA</em>.',
    exp2_b2: 'Decomposed and scheduled computation graphs for multi-thread / multi-stream parallel execution; reduced memory-access latency through shared-memory and register reuse.',
    exp2_b3: "Integrated the optimised operators into the company's in-house framework, matching or exceeding official CUDA performance, and delivered reports for the AI chip SDK operator library.",

    h_pub: 'Publications',
    f_all: 'All', f_first: 'First-author only',
    l_paper: 'Paper', l_code: 'Code',

    h_svc: 'Academic Service',
    svc1: 'Reviewer for <em>IEEE TPAMI</em>, <em>AAAI</em>, <em>ECCV</em>, <em>ACM MM</em>, <em>Information Fusion</em>, and other journals and conferences.',

    h_award: 'Awards',
    aw1: '<b>CSC National Scholarship</b> for joint Ph.D. training, China Scholarship Council',

    footer: 'Last updated: September 2026 &middot; Built with plain HTML/CSS'
  },

  zh: {
    role: '软件工程 博士研究生',
    affil1: '人工智能与计算机学院',
    affil2: '江南大学 · 江苏无锡 · 中国',
    ct_email: '邮箱', ct_tel: '电话',
    btn_cv: '简历 (PDF)', btn_inst: '学院主页',
    m_cit: '被引次数', m_h: 'h 指数', m_i10: 'i10 指数', m_pub: '论文数',

    nav_about: '个人简介', nav_news: '最新动态', nav_edu: '教育经历', nav_exp: '实习经历',
    nav_pub: '发表论文', nav_svc: '学术服务', nav_award: '荣誉奖项',
    lang_btn: 'EN',

    h_about: '个人简介',
    about_p1: '我于 2021 年获<strong>金陵科技学院</strong>物联网工程专业工学学士学位（中国南京）。'
      + '同年进入<strong>江南大学</strong>（中国无锡）攻读计算机科学与技术硕士学位，后转入博士阶段。'
      + '现为江南大学<strong>江苏省模式识别与计算智能工程实验室</strong>软件工程专业博士研究生，'
      + '师从<a href="https://scholar.google.com/citations?user=5IST34sAAAAJ&amp;hl=en" target="_blank" rel="noopener"><strong>吴小俊教授</strong></a>'
      + '与<a href="https://www.surrey.ac.uk/people/josef-kittler" target="_blank" rel="noopener"><strong>Josef Kittler 教授</strong></a>。'
      + '2025 至 2026 年，受国家留学基金委（CSC）资助赴<strong>英国萨里大学</strong>联合培养，'
      + '合作导师为 Josef Kittler 教授。',
    about_p2: '我的研究聚焦于<strong>多模态图像融合</strong>，重点关注复杂与恶劣环境下的鲁棒性。'
      + '相关工作着力解决现有方法在恶劣天气、模态失配等条件下融合跨模态数据时性能显著退化的问题。'
      + '研究专长亦涵盖图像配准、超分辨率等底层视觉任务，以及模型在边缘设备上的高效部署。',
    about_p3: '相关成果发表于 <em>IEEE Transactions on Multimedia</em>（TMM）、'
      + '<em>International Journal of Computer Vision</em>（IJCV）、<em>Information Fusion</em>、'
      + '<em>IEEE Transactions on Instrumentation and Measurement</em>（TIM）、'
      + '<em>ACM Transactions on Multimedia Computing, Communications, and Applications</em>（TOMM）、'
      + 'CVPR 与 ICPR 等期刊与会议。',
    chip1: '多模态图像融合', chip2: '红外-可见光融合', chip3: '图像配准',
    chip4: '扩散模型', chip5: 'Transformer', chip6: '卷积神经网络',
    chip7: '显著性检测', chip8: '恶劣天气复原', chip9: '边缘端高效部署',

    h_news: '最新动态',
    news1: '两篇一作论文分别发表于《IEEE Transactions on Multimedia》与《International Journal of Computer Vision》。',
    news2: '加入<strong>博世（中国）投资有限公司</strong>（CR-RIX/AP），担任端到端自动驾驶方向战略实习生。',
    news3: '获<strong>国家留学基金委（CSC）公派奖学金</strong>，赴萨里大学联合培养。',
    news4: '<em>DDBFusion</em> 发表于《Information Fusion》（SCI 一区 Top，影响因子 14.7）。',
    news5: '<em>One Model for All</em> 被 <strong>CVPR 2025</strong> 接收。',

    h_edu: '教育经历',
    edu1_t: '国家公派联合培养博士 · 模式识别',
    edu1_s: '英国萨里大学 · 吉尔福德',
    edu2_t: '软件工程 博士', edu2_s: '江南大学 · 无锡',
    edu3_t: '计算机科学与技术 硕士', edu3_tag: '转博，未取学位',
    edu3_s: '江南大学 · 无锡',
    edu4_t: '物联网工程 学士',
    edu4_s: '金陵科技学院 · 南京',

    h_exp: '实习经历',
    exp1_t: '自动驾驶战略实习生', exp1_s: '博世（中国）投资有限公司',
    exp1_b1: '负责端到端自动驾驶算法预研。',
    exp1_b2: '优化 <em>DiffusionDrive</em> 感知层骨干网络，主导设计多尺度 BEV 感知与稀疏精细化特征提取策略。',
    exp1_b3: '结合 Vision Transformer 动态筛选关键空间特征，并使用 Register Tokens 进行轨迹预测，消除高分辨率特征融合带来的计算冗余。',
    exp1_b4: '在保证推理实时性的前提下，于 NAVSIM 纯视觉闭环评测中取得具有竞争力的 PDMS 成绩。',
    exp2_t: '深度学习框架开发工程师', exp2_s: '国家超级计算无锡中心',
    exp2_b1: '使用 <em>C++/CUDA</em> 将 PyTorch 算子移植并优化到自研 AI 芯片上。',
    exp2_b2: '对计算图进行分解与调度，实现多线程/多流并行执行；通过共享内存与寄存器复用降低访存延迟。',
    exp2_b3: '将优化后的算子集成入企业自研深度学习框架，性能达到或超过官方 CUDA 版本，并输出算子库性能报告。',

    h_pub: '发表论文',
    f_all: '全部', f_first: '仅看一作',
    l_paper: '论文', l_code: '代码',

    h_svc: '学术服务',
    svc1: '担任 <em>IEEE TPAMI</em>、<em>AAAI</em>、<em>ECCV</em>、<em>ACM MM</em>、<em>Information Fusion</em> 等期刊与会议审稿人。',

    h_award: '荣誉奖项',
    aw1: '<b>国家留学基金委（CSC）公派奖学金</b>，联合培养博士研究生',

    footer: '最后更新：2026 年 9 月 &middot; 纯 HTML/CSS 构建'
  }
};

(function () {
  'use strict';

  var KEY = 'site-lang';

  function pickInitial() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* 隐私模式忽略 */ }
    if (saved === 'en' || saved === 'zh') return saved;
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  function apply(lang) {
    var dict = I18N[lang] || I18N.en;

    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v !== undefined) el.textContent = v;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-html]'), function (el) {
      var v = dict[el.getAttribute('data-i18n-html')];
      if (v !== undefined) el.innerHTML = v;
    });

    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    // 正文用中文时换用更适合中文字形的字体栈
    document.body.style.fontFamily = lang === 'zh'
      ? '"PingFang SC","Microsoft YaHei","Hiragino Sans GB",system-ui,sans-serif'
      : '';
  }

  var current = pickInitial();
  var btn = document.getElementById('lang-toggle');

  function setLang(lang) {
    current = lang;
    apply(lang);
    try { localStorage.setItem(KEY, lang); } catch (e) { /* ignore */ }
  }

  if (btn) {
    btn.addEventListener('click', function () {
      setLang(current === 'zh' ? 'en' : 'zh');
    });
  }

  apply(current);
})();
