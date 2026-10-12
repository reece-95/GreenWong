/*
 * 翻译文案
 *
 * 英文原文只写在 index.html 里（main.js 启动时会自动读取），这里不再重复一遍，
 * 避免两处文案不一致。
 *
 * - zh：页面上每个 data-i18n / data-i18n-placeholder / data-i18n-aria-label /
 *       data-i18n-title 的 key 都要有中文。缺了会在控制台警告，并显示英文原文。
 * - en：只放 HTML 里没有、由 JS 动态生成的英文文案。
 *
 * 文案里可以用 {name} 占位，例如 "第 {n} 条"。
 */
window.GW_TRANSLATIONS = {
    en: {
        lang_toggle_label: 'Switch to Chinese',
        menu_open: 'Open menu',
        menu_close: 'Close menu',
        testi_dot: 'Show review {n} of {total}',
        form_success: 'Thank you! Your request has been sent to Reece. We will contact you shortly.'
    },
    zh: {
        // 页面与通用
        page_title: 'GreenWong 草坪护理 | 陶朗加',
        skip_link: '跳到主要内容',
        lang_toggle_label: '切换为英文',
        menu_open: '打开菜单',
        menu_close: '关闭菜单',

        // 导航
        nav_home: '首页',
        nav_services: '服务项目',
        nav_pricing: '价格表',
        nav_about: '关于我们',
        nav_contact: '联系/预约',

        // 首屏
        hero_title: '更绿的草坪，更开心的家！',
        hero_subtitle: '新西兰陶朗加及周边地区专业的草坪护理服务。',
        hero_cta: '立即预约',

        // 服务
        services_title: '我们的服务',
        services_desc: '辛苦活交给我们，您只管享受。',
        srv_mow_title: '上门除草',
        srv_mow_desc: '适用于各种大小的草坪。包含修边和碎草清理。',
        srv_garden_title: '庭院维护',
        srv_garden_desc: '除草、修剪和种植，让您的花园保持活力。',
        srv_cleanup_title: '园艺整理',
        srv_cleanup_desc: '清除绿色垃圾和整体整理，打造整洁外观。',

        // 价格
        price_title: '服务价格',
        price_desc: '价格透明，服务陶朗加居民。',
        price_popular: '最受欢迎',
        price_small_title: '小型庭院',
        price_med_title: '中型庭院',
        price_large_title: '大型庭院',
        price_area_small: '100–200 平方米',
        price_area_med: '200–400 平方米',
        price_area_large: '400 平方米以上',
        price_feature_1: '剪草与修边',
        price_feature_2: '碎草清理',
        price_feature_3: '基础除杂草',
        price_custom: '全方位园艺护理',

        // 关于
        about_title: '关于 GreenWong',
        about_founder: '创始人：Reece Wong',
        about_text_1: '嗨，我是 Reece。创立 GreenWong Lawn Care 的初衷很简单：为陶朗加社区带来专业、环保且省心的草坪护理服务。',
        about_text_2: '我们相信整洁的草坪能为一个家带来快乐。无论是定期除草还是单次清理，我们都像对待自己家一样对待每一个院子。',

        // 评价
        testi_title: '客户评价',
        stars_5: '5 星（满分 5 星）',
        testi_dot: '显示第 {n} 条评价（共 {total} 条）',
        testi_1: '“Reece 干得太棒了！我的草坪从未如此翠绿。强烈推荐给陶朗加的朋友们。”',
        testi_2: '“高效、快捷，沟通顺畅。中英双语服务对我的父母来说非常方便。”',

        // 联系与表单
        contact_title: '联系与预约',
        contact_desc: '获取免费报价或立即预约服务。',
        contact_info_title: '联系方式',
        location_text: '陶朗加、芒格努伊山、帕帕莫阿',
        map_title: '陶朗加地图',
        map_link: '在 Google 地图中打开',
        form_title: '预约服务',
        form_name: '姓名',
        form_phone: '电话',
        form_service: '服务类型',
        form_date: '期望日期',
        form_message: '留言（选填）',
        form_ph_name: '您的姓名',
        form_ph_phone: '您的电话号码',
        form_ph_message: '有什么特殊要求吗？',
        form_submit: '提交预约',
        form_success: '谢谢！您的请求已发送给 Reece，我们会尽快联系您。',

        // 页脚
        footer_rights: '保留所有权利。',
        social_wechat: '微信'
    }
};
