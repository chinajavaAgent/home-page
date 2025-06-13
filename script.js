// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 群组筛选功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 给当前按钮添加active类
            this.classList.add('active');
            
            // 这里可以添加实际的筛选逻辑
            const filterCategory = this.textContent.trim();
            console.log('筛选类别:', filterCategory);
            
            // 示例：可以添加实际筛选逻辑
            // const groupCards = document.querySelectorAll('.group-card');
            // groupCards.forEach(card => {
            //    const cardCategory = card.querySelector('.group-tag').textContent;
            //    if (filterCategory === '全部群组' || cardCategory === filterCategory) {
            //        card.style.display = 'block';
            //    } else {
            //        card.style.display = 'none';
            //    }
            // });
        });
    });

    // 表单验证
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const interestSelect = document.getElementById('interest');
            const messageTextarea = document.getElementById('message');
            
            // 简单验证
            if (!nameInput.value.trim()) {
                highlightError(nameInput);
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                highlightError(emailInput);
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            if (!interestSelect.value) {
                highlightError(interestSelect);
                isValid = false;
            } else {
                removeError(interestSelect);
            }
            
            if (!messageTextarea.value.trim()) {
                highlightError(messageTextarea);
                isValid = false;
            } else {
                removeError(messageTextarea);
            }
            
            if (isValid) {
                // 这里可以添加表单提交逻辑
                alert('表单提交成功！我们会尽快联系您。');
                contactForm.reset();
            }
        });
    }

    // 添加滚动动画
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .group-card, .profile-card, .story-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    // 初始动画
    animateOnScroll();
    
    // 滚动时触发动画
    window.addEventListener('scroll', animateOnScroll);

    // 渲染群组
    renderGroupFilters(groupData, renderGroups);
    renderGroups(groupData);

    // 渲染名片
    renderProfiles(profileData);

    // 通用二维码弹窗逻辑
    function showQrModal() {
        const modal = document.getElementById('qrModal');
        if (modal) modal.style.display = 'flex';
    }
    function hideQrModal() {
        const modal = document.getElementById('qrModal');
        if (modal) modal.style.display = 'none';
    }

    // 绑定二维码弹窗关闭
    const qrModalClose = document.getElementById('qrModalClose');
    const qrModal = document.getElementById('qrModal');
    if (qrModalClose && qrModal) {
        qrModalClose.onclick = hideQrModal;
        qrModal.querySelector('.qr-modal-backdrop').onclick = hideQrModal;
    }

    // 绑定所有相关按钮弹窗
    // 1. 提交AI名片
    setTimeout(function() { // 确保渲染后再绑定
        const submitProfileBtn = document.querySelector('.profile-cta .btn-primary');
        if (submitProfileBtn) {
            submitProfileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showQrModal();
            });
        }
    }, 0);

    // 2. 申请加入（群组卡片）
    document.body.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('btn-secondary') && target.textContent.includes('申请加入')) {
            e.preventDefault();
            showQrModal();
        }
        // 3. 查看二维码（名片卡片）
        if (target.classList.contains('btn-outline') && target.textContent.includes('查看二维码')) {
            e.preventDefault();
            showQrModal();
        }
        // 4. 开始匹配
        if (target.classList.contains('btn-primary') && target.textContent.includes('开始匹配')) {
            e.preventDefault();
            showQrModal();
        }
    }, false);

    // 下载二维码功能
    const qrDownloadBtn = document.getElementById('qrModalDownload');
    if (qrDownloadBtn) {
        qrDownloadBtn.onclick = function() {
            const img = document.getElementById('qrModalImg');
            if (!img) return;
            const url = img.src;
            const a = document.createElement('a');
            a.href = url;
            a.download = 'AI社群二维码.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }
});

// 辅助函数
function highlightError(element) {
    element.style.borderColor = '#e53e3e';
    element.style.backgroundColor = 'rgba(229, 62, 62, 0.05)';
}

function removeError(element) {
    element.style.borderColor = '';
    element.style.backgroundColor = '';
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

// 群组数据（示例，实际可从后端获取）
const groupData = [
  {
    name: "亦心科技xAI共创经纪人",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240923-667300-cdb4517c45764380a4ea3414c863e3fa.客服微信.jpg",
    memberCount: 177,
    createdDate: "2024-08-04T11:37:20.000+00:00",
    description: "社群总数：34个\n主要类型：悟空图像交流群、AI闪绘交流群、与其他用户/平台联合建的拉新群\n社群介绍：每天都会发布视频教程、图文教程、海报分享，有时候会发布优惠活动信息\n能收获什么：产品的一线运营、研发人员答疑解惑，交流产品心得，提出改进建议等;新用户可以获得14天的工具测试。工具100%好评，效果惊人",
    categorys: ["AI绘画"],
    tags: ["AI工具"],
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-402838-473dfa83a80b45c49bd3f065e791aeeb.亦新.jpg"
  },
  {
    name: "周周黑客松深圳2群",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-844872-c10cc9857af54d9190b2c2bba14d541f.客服微信.jpg",
    memberCount: 277,
    createdDate: "2024-08-24T02:40:56.000+00:00",
    description: "HackathonWeekly周周黑客松是一个公益开源的极客社区，定期举办交流会和黑客松，旨在帮助每个参与者实现最小可行产品。\n\n我们的特点\n- 面向 Builder / Maker\n- 定期举办：每周都有活动，为创新提供持续的平台\n- 活动形式：交流会和黑客松。交流会=轻路演+Idea 脑暴+社交组队+共同办公\n- 专注MVP：帮助参与者快速开发最小可行产品\n- 重视落地：实践大于空谈，强调将创意转化为实际的解决方案\n- 互助友爱：倡导利他精神，促进参与者之间的合作与交流",
    categorys: ["AI技术开发", "AI比赛"],
    tags: ["AI技术开发"],
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-455441-8ba2d510b846495bb524a588d64391d4.周周黑客松深圳2群.jpg"
  },
  {
    name: "北航AI科研社群",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-460169-a0751aee045d4a50925885423c191d84.客服微信.jpg",
    memberCount: 387,
    createdDate: "2024-08-24T06:38:57.000+00:00",
    description: null,
    categorys: ["AI实习就业"],
    tags: ["AI资讯"],
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-166763-0824fd8fa4cd42648d46b879a8d2828c.北航本研AI科研社群.jpg"
  },
  {
    name: "02-赤辰AI技术作品发布群",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-149377-df2bd277ed9b47ca8e552655c3dbd5c5.客服微信.jpg",
    memberCount: 153,
    createdDate: "2024-08-24T06:38:59.000+00:00",
    description: "社群于2023年5月创建，6月初启动对外招募，目前已经吸引了几百位会员。我们的社群专注于AI项目与技术实战，我们的目标是在AI领域内建立高标准，重交付的技术学习和实战圈子。\nAI实战圈运营成果：1、6期AI变现项目训练营和SOP；\n2、50+项目AI爆款作品教程\n3、600+条AI项目变现信息差\n4、采集分享了8000+套AI和项目运营课程\n5、累计向学院赠送3万+美金的AI会员账号\n现在分享的02-赤辰AI技术作品发布群，是大家的入门群，是以AI技术和红利项目学习为主，我会不定时发布一些AI技术、作品、项目推文和训练营截图，以及我对一些AI和运营的思考见解",
    categorys: ["AI实战"],
    tags: ["AI实战"],
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-980457-0cf8b82fcb2b4d9daece58df74242833.02-赤辰.jpg"
  },
  {
    name: "小陈小红书聊天群，绘画如何变现",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-806511-af6f22d8b4f34985b9309404a6d60e69.客服微信.jpg",
    memberCount: 460,
    createdDate: "2024-08-24T07:56:31.000+00:00",
    description: "本群为擅长AI绘画、PS等绘画技能的朋友提供接单渠道，群内不定时发布任务，包括刺绣、手机壳、画品等被选中的作品，马上支付，真实可靠。想做副业的伙伴可以加入",
    categorys: ["AI接单"],
    tags: ["AI接单", "AI资讯"],
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-637821-d77cfceb5d77448a9cd589c66195b07f.小陈接单.jpg"
  },
  {
    name: "AI实验室I交流学习47群",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-377435-c2f595be4e95475d9f88ed9e0c7d5700.客服微信.jpg",
    memberCount: 168,
    createdDate: "2024-08-24T07:56:32.000+00:00",
    description: "我是大国，今年是大国互联网创业的第5年，也是刚好在30岁的年龄。过去的几年时间，一直深耕运营和AI赛道，大国不仅仅做出来多篇10W+的爆款内容，至少被100万人看到我的作品，更是沉淀了10万+互联网人在私域，为此付费的人数也有5000多人，业务既覆盖了C端个人也覆盖了B端企业，我想在内卷的当下，我依然还可以保持逆势成长，一定有自己的思维模型和认知突破。\n新朋友通过加AI群来到我们社群的朋友，赠送价值上千的知识库，里面包括新手入门必学、AI对话能力、AI写作能力、AI绘画能力、AI视频能力、AI设计能力、AI数字人应用、AI声音能力、AI电商技能、AI企业培训、AI创业投资、AI应用实战、AI变现案例、AI行业大会学习、AI专题学习、AI内容创作者专栏等，另外还有各种导航SORA、CLaude等学习手册",
    categorys: ["AI实战"],
    tags: ["AI资讯"],
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-789095-2ae8168817fa4c058f872b4e9e883420.大国-AI实验.jpg"
  },
  {
    name: "通往AGI之路",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-450847-6e06279308cf40c1ba821cc1a76e4611.客服微信.jpg",
    memberCount: 384,
    createdDate: "2024-08-24T12:34:16.000+00:00",
    description: "WayToAGI是由一群热爱AI的专家和爱好者共同建设的开源 AI知识库，大家贡献并整合各种 AI 资源，使得大家都可以轻松学习各种AI知识，应用各类 AI 工具和实战案例等。WayToAGI提供了一系列开箱即用的工具，文生图、文生视频、文生语音等详尽的教程，将你的文字化为视觉与听觉的现实。追踪 AI 领域最新的进展，时刻更新，让你紧跟 AI领域的步伐，每次访问都能有新的收获。无论你是 AI初学者还是行业专家，都可以在这里发掘有价值的内容，让更多的人因 AI 而强大。",
    categorys: ["AI交流圈", "AI共创组团", "AI资讯"],
    tags: ["AI交流圈", "AI共创组团", "AI资源", "AI资讯"],
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-635708-71abc210d3e0428cad110078bfb67dda.AJ-通往AGI之路.jpg"
  },
  {
    name: "【西羊石小报童】AI视频VIP交流3群",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-987010-fb263d8b6d91466dab40777596076304.客服微信.jpg",
    memberCount: 414,
    createdDate: "2024-08-24T13:41:44.000+00:00",
    description: "由西堂、小石、羊羊AI团队创建，专注于视频号，AI绘画，AI视频的前沿知识和实战项目分享。\n进群的朋友可以获得AI视频案例（100个爆款拆解）：100个AI视频爆款案例的拆解，AI视频工具的教学；AI自媒体主流平台的研究",
    categorys: ["AI视频"],
    tags: ["AI技能学习"],
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-855659-418390859b3e4bbeaa09cca90c505c08.西羊石VIP.jpg"
  },
  {
    name: "百万IP共创计划(Cafe  Day)",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-510462-07622d6013374bd498c7b63478503ffa.客服微信.jpg",
    memberCount: 217,
    createdDate: "2024-08-24T13:41:45.000+00:00",
    description: "由创新天使团发起的去中心化创新工作坊：周没无聊，可以一起找个咖啡馆坐坐，读书、聊天、充电、带娃，做自己喜欢的事情，遇到感兴趣的话题可以一起交流、沟通灵感想法，碰撞创新火花，结交同行伙伴，洽谈项目合作。一杯咖啡，一部电脑、一本书，度过充实的一天，放慢节奏，准备加速。目前已经由16个城市群：北京、上海、广州、深圳、杭州、郑州、南京、西安、武汉、济南、厦门、长沙、合肥、成都、大连、台湾等。\n成立到现在已经孵化：心之道社区；DIDA时间银行区块链平台；儿必康（少儿ADHD多动症康复）；律友Talk;豆包妈妈等。",
    categorys: ["AI共创组团", "AI创业", "AI技术开发"],
    tags: ["AI交流", "AI共创", "AI找搭子组团"],
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20240824-538851-6baa37d42b394866b763bd61da10b70a.船长-百万IP.jpg"
  }
];

function getAllCategories(groups) {
  const set = new Set();
  groups.forEach(g => {
    if (Array.isArray(g.categorys)) {
      g.categorys.forEach(c => set.add(c));
    }
  });
  return Array.from(set);
}

function renderGroupFilters(groups, onFilter) {
  const filters = document.getElementById('groupFilters');
  if (!filters) return;
  const categories = getAllCategories(groups);
  filters.innerHTML = [
    `<button class="filter-btn active" data-category="all">全部群组</button>`,
    ...categories.map(cat => `<button class="filter-btn" data-category="${cat}">${cat}</button>`)
  ].join('');

  // 绑定点击事件
  const btns = filters.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.getAttribute('data-category');
      if (cat === 'all') {
        onFilter(groups);
      } else {
        onFilter(groups.filter(g => Array.isArray(g.categorys) && g.categorys.includes(cat)));
      }
    });
  });
}

function renderGroups(groups) {
  const grid = document.getElementById('groupGrid');
  if (!grid) return;
  grid.innerHTML = groups.map(group => `
    <div class="group-card">
      <div class="group-header">
        <img src="${group.headerImage}" alt="${group.name}">
        <span class="group-tag">${group.categorys && group.categorys.length ? group.categorys[0] : 'AI群组'}</span>
      </div>
      <div class="group-content">
        <h3>${group.name}</h3>
        <p>${group.description ? group.description.split('\n')[0] : '优质AI领域社群'}</p>
        <div class="group-meta">
          <span>${group.memberCount} 成员</span>
          <span>${group.tags && group.tags.length ? group.tags.join('、') : ''}</span>
        </div>
        <a href="${group.qrcode}" class="btn-secondary" target="_blank">申请加入</a>
      </div>
    </div>
  `).join('');
}

// 名片数据（示例，实际可从后端获取）
const profileData = [
  {
    id: "145",
    cityName: "北京市",
    name: "杨海波（悟空）",
    introduction: "北京亦心科技有限公司专注于专业图像处理软件的技术研究与产品开发，引领AI+设计\n图像处理，图像生成",
    requestInfo: "学校、政府单位、企业资源；宣传推广资源\n",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-857201-dd8bd8677e2e464aa3cde927a0cf2f60.安然的.jpg",
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-594129-6f21089fe7e34c59958b13beb2a1f608.杨海波.jpg",
    provideResource: "AI动画制作，图像处理技术支持\n",
    bussinessCardTags: [
      { name: "AI创作者" },
      { name: "AI绘画" },
      { name: "AI视频" },
      { name: "AI工具" }
    ]
  },
  {
    id: "144",
    cityName: "成都市",
    name: "姚乔（Hank）",
    introduction: "2年游戏开发，8年前端开发（4年全栈），熟悉互联网常见的产品形态（PC/H5/小程序/管理后台），对产品设计、AI 领域有浓厚兴趣，最近在研究 AI 数字人方向业务。\n",
    requestInfo: null,
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-772635-991127d3b8b94e7992ad3e4d49e2ce49.安然的.jpg",
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-816416-62f250cd2c9b4567bdb117fb4a8aad97.姚乔.jpg",
    provideResource: "2年游戏开发，8年前端开发（4年全栈），\n熟悉互联网常见的产品形态（PC/H5/小程序/管理后台），\n对产品设计、AI 领域有浓厚兴趣，最近在研究 AI 数字人方向业务。\n能提供：产品开发 / 数字人视频合成 / 海外电商\n\n",
    bussinessCardTags: [
      { name: "全栈开发" },
      { name: "产品设计" }
    ]
  },
  {
    id: "143",
    cityName: "重庆市",
    name: "何平安",
    introduction: "全栈开发工程师，能独立开发一个项目完成设计上线宣传，AIGC领域爱好者，设计过独立的ai绘画对话生成等工具。\n",
    requestInfo: "网站用户量和使用量",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-337311-eda1622f9fc04d708a795f225853b578.安然的.jpg",
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-512909-37b0fed1aa644c56b007bb52560dba47.何平安.jpg",
    provideResource: "个性化智能对话（根据对话数据分析用户喜好)，云端AI绘画，智谱打标器等优秀AIGC工具，拥有用户在该平台活动的数据万条。",
    bussinessCardTags: [
      { name: "全栈开发" },
      { name: "产品设计" },
      { name: "编程" }
    ]
  },
  {
    id: "142",
    cityName: "北京市",
    name: "秦少卫",
    introduction: "开源图片编辑器 vue-fabric-editor 作者，10+软件开发经验，企业级在线设计工具 快图设计创始人。\n",
    requestInfo: "被更多企业技术负责人看到我们的项目，与有意向参与我们开源的开发者建立深度合作，开源项目曝光。",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-759309-64b2555d0019461fa5fd626f8dbe4cc4.安然的.jpg",
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-749797-53bfa35b3b6346849a82b149c285b652.秦少卫.jpg",
    provideResource: "个人开源项目商业化经验，掘金优秀作者，复杂前端架构设计、稳定性治理。\n\n快图设计，企业级在线设计工具，目标是帮助企业快速搭建在线设计工具，如自媒体图片、批量生成图片、电商图片、POD 柔性定制等在线图片设计场景。",
    bussinessCardTags: [
      { name: "AI绘画" },
      { name: "计算机视觉工程师" },
      { name: "产品设计" },
      { name: "高级工程师" }
    ]
  },
  {
    id: "141",
    cityName: "北京市",
    name: "杨坤",
    introduction: "一名AI创业者，寻资金生意合作，互联网品效营销专家",
    requestInfo: "提供产品CPS高额分成合作",
    qrcode: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-235591-b07bf0688f5f45ee9d80140b222b7643.安然的.jpg",
    headerImage: "https://story-app.oss-cn-hangzhou.aliyuncs.com/images/20241129-239565-6d580d99069b4b919f611649c88c25b2.杨坤.jpg",
    provideResource: "开发了啵啵动漫AI\nAI数十种功能API调用接口，\n微信、支付宝支付订阅权限，\n网络文化经营许可证待办理，\n大模型算法备案咨询",
    bussinessCardTags: [
      { name: "AI项目操盘手" },
      { name: "AI创作经纪人" },
      { name: "市场商务" }
    ]
  }
];

function renderProfiles(profiles) {
  const container = document.getElementById('profilesContainer');
  if (!container) return;
  container.innerHTML = profiles.map(profile => `
    <div class="profile-card">
      <div class="profile-image">
        <img src="${profile.headerImage}" alt="${profile.name}">
      </div>
      <div class="profile-info">
        <h3>${profile.name}</h3>
        <p class="profile-title">${profile.cityName || ''}</p>
        <div class="profile-tags">
          ${(profile.bussinessCardTags || []).map(tag => `<span>${tag.name}</span>`).join('')}
        </div>
        <p class="profile-desc">${profile.introduction ? profile.introduction.split('\n')[0] : ''}</p>
        <div class="profile-connect">
          <a href="${profile.qrcode}" class="btn-outline" target="_blank">查看二维码</a>
        </div>
      </div>
    </div>
  `).join('');
} 