// ==UserScript==
// @name         (持续更新)CSDN页面浮窗广告完全过滤净化(净化复制内容|自动展开|让你专注于文章|不影响功能使用)
// @namespace    https://github.com/AdlerED
// @version      1.4.3
var version = "1.4.3";
// @description  最好用的脚本，没有之一|CSDN|博客|✔️超级免会员|✔️防外链重定向|✔️推荐内容自由开关|✔️论坛独家未登录自动展开文章、评论|✔️全面净化|✔️沉浸阅读|✔️净化剪贴板 >>> 请注意！由于CSDN“反净化机制”日益强大，网站结构修改频率很高，请选择经常更新的脚本！较旧的脚本可能已经失去维护，无法起到净化效果！ <<<
// @author       Adler
// @connect      www.csdn.net
// @include      *://*.csdn.net/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @note         19-08-01 1.4.3 感谢油叉用户“ddddy”的反馈，去除了更多推广广告
// @note         19-07-30 1.4.2 感谢油叉用户“周义杰”的反馈，增加了防CSDN外链重定向的功能（CSDN臭流氓）
// @note         19-07-20 1.4.1 修复了推荐内容开关跨文章无效问题（忘了配置Cookie作用域）
// @note         19-07-19 1.4.0 1. 构架大更新 2. 感谢GitHub朋友"lukemin"的反馈，加入了下方推荐内容是否隐藏开关（实用）
// @note         19-07-13 1.3.0 感谢Github朋友“Holaplace”的反馈，修复了文章无法自动展开的问题（CSDN总改这个，令人头疼）
// @note         19-06-08 1.2.6 感谢油叉用户“DeskyAki”的反馈，修复了文章无法自动展开的问题
// @note         19-06-07 1.2.4 修复了登录后评论无法正常打开的问题
// @note         19-06-07 1.2.3 感谢油叉用户"永远的殿下"的反馈，在一上午的努力攻克下，终于实现了未登录展开评论的语句
// @note         19-06-05 1.2.0 修复了评论无法自动展开的BUG
// @note         19-06-04 1.1.9 修复了无法自动展开的BUG（自闭了）
// @note         19-06-04 1.1.6 CSDN太坏了，把“消息”按钮的Class设置成了“GitChat”，所以修复了“消息”按钮消失的问题
// @note         19-06-04 1.1.5 1. 优化了论坛体验 2.美化、优化代码结构
// @note         19-06-04 1.1.4 感谢GitHub朋友“iamsunxing”的反馈，增加了论坛广告匹配规则
// @note         19-06-03 1.1.3 感谢GitHub朋友“wangwei135”的反馈，去除了评论区上方的广告
// @note         19-05-27 1.1.2 感谢油叉用户“夏伟杰”的反馈，修复了富文本编辑器无法使用的问题
// @note         19-05-25 1.1.0 1. 修复了主页广告的问题 2. 论坛自动展开 3. 论坛广告消除
// @note         19-05-25 1.0.9 感谢油叉用户“渣渣不准说话”的反馈，修复了收藏按钮消失的问题
// @note         19-03-01 1.0.3 添加页面选择性过滤规则
// @note         19-03-01 1.0.2 增加了净化剪贴板功能
// @note         19-03-01 1.0.1 修复了排版问题, 优化了代码结构
// @note         19-02-26 1.0.0 初版发布
// ==/UserScript==

(function() {
	var currentURL = window.location.href;
	console.log("你正在访问 " + currentURL + " , 正在为你匹配过滤规则......");
	var article = /article/;
	var postedit = /postedit/;
	console.log("欢迎, 正在执行CSDN净化插件! Powered By Adler WeChat: 1101635162");
	var count = 0;
	if (count == 0) {
		console.log("正在进行第一次Kill操作......");
		killAll();
	}

    //CSDN臭不要脸重定向外链
    $("#content_views").off();
    //去除推广广告
    $("li[data-type='ad']").remove();

	//赚零钱改为GitChat(仅运行一次)
	//var gitChat = document.getElementsByClassName("gitChat");
	//gitChat[0].remove();
	//主页右侧的今日推荐
	var rightBox = document.getElementsByClassName("right_box");
	//rightBox[0].remove();
	//setTimeout(function (){
	//    rightBox[0].remove();
	//    rightBox[1].remove();
	//}, 1000)
	//干掉右侧栏，并让左侧栏填充屏幕
	if (article.test(currentURL)) {
		$("aside").remove();
		$("main").css("width", "100%");
		//去除评论区上面的广告
		$("div#dmp_ad_58").remove();
	}
	//去除剪贴板劫持
	try {
		csdn.copyright.init("", "", "");
	} catch (err) {}

	//推荐内容开关cookie
	var removeCookie = $.cookie("remove");
	var remove;
	if (removeCookie == undefined) {
		$.cookie('remove', true, {
            path : '/'
        });
		remove = true;
	}
	if (removeCookie == "true") {
		remove = true;
	} else {
		remove = false;
	}

	//删除推荐内容（自定义）
	if (remove) {
		$(".recommend-box").remove();
	}

	//推荐内容开关
	$(".blog-content-box").after("<div class='blog-content-box' id='switch'></div>");
	if (remove) {
		$("#switch").append("<button class='hide-recommend-button'>显示推荐内容</button>");
	} else {
		$("#switch").append("<button class='hide-recommend-button'>隐藏推荐内容</button>");
	}
	$(".hide-recommend-button").css({
		"width": "270px",
		"height": "40px",
		"border-width": "0px",
		"border-radius": "3px",
		"background": "#A9A9A9",
		"cursor": "pointer",
		"outline": "none",
		"font-family": "Microsoft YaHei",
		"color": "white",
		"font-size": "17px",
		"display": "block",
		"margin": "0 auto",
	});
	$(".hide-recommend-button").hover(

	function() {
		$(".hide-recommend-button").css("background", "#D3D3D3");
	}, function() {
		$(".hide-recommend-button").css("background", "#A9A9A9");
	});

	//开关监听
	$(".hide-recommend-button").click(function() {
		if ($.cookie('remove') == "true") {
            $.cookie('remove', false, {
                path : '/'
            });
		} else {
            $.cookie('remove', true, {
                path : '/'
            });
		}
		location.reload();
	});

	var starting = setInterval(function() {
		count++;
		if (count > 50) {
			console.log("净化已完成! 请享受绿色的CSDN~");
			$("#green").html("已净化");
			clearInterval(starting);
		} else {
			if (count >= 5 && count <= 40) {
				//展开所有内容，包括评论
				try {
					//已登录用户展开评论
					document.getElementById("btnMoreComment").click();
					//*** 非登录情况下评论展开，请勿借鉴 ***
					//删除查看更多按钮
					$("#btnMoreComment").parent("div.opt-box").remove();
					//展开内容
					$("div.comment-list-box").css("max-height", "none");
					//**关闭登录提示框**
					//改回背景颜色
					$(".login-mark").remove();
					//删除登录框
					$(".login-box").remove();
				} catch (err) {}

				//查看更多，CSDN经常换来换去的，服气
				try {
					$(".btn-readmore").click();
					$("#btn-readmore").click();
					document.getElementsByClassName("btn-readmore")[0].click();
					document.getElementsById("btn-readmore")[0].click();
				} catch (err) {}
				//论坛自动展开
				$(".js_show_topic").click();
			}
			//进度条
			console.log("正在干掉遗漏的浮窗(不会影响性能, 请无视该消息)......");
			killAll();
		}
	}, 100);

	//由于部分交互非即时打开, 所以一直循环
	setInterval(function() {
		//主页中间的广告
		$(".J_adv").remove();
		//主页有新的内容横条
		$(".feed-fix-box").remove();
		//主页广告iframe
		if (currentURL == "https://www.csdn.net/") {
			$("iframe").remove();
		}
	}, 500);
})();

function killAll() {
	//核心代码
	//CLASSES
	var classList = new Array(
	// ****** 主页 *****
	//头部广告
	"banner-ad-box",
	//右侧广告
	"slide-outer",
	//顶栏无用选项
	//APP
	"app-btn",
	//VIP
	"vip-caise",
	//右侧浮窗(客服、客户端二维码)
	"csdn-side-toolbar",
	//右侧详情
	"persion_article",
	//顶部轮播
	"carousel",
	// ****** 文章页 ******
	//快来写博客吧
	"blog_tip_box",
	//推荐关注用户
	"blog-expert-recommend-box",
	//右侧工具栏（注释原因：收藏消失）
	//"tool-box",
	//右下角VIP
	"meau-gotop-box",
	//广告
	"mediav_ad", "pulllog-box", "recommend-ad-box", "box-shadow", "type_hot_word", "fourth_column",
	//高分辨率时右侧文章推荐
	"right-item",
	// ****** 下载 ******
	"fixed_dl", "indexSuperise",
	// ****** 论坛 ******
	//推荐广告
	//底部相关文章里面的广告
	"bbs_feed_ad_box", 'recommend-ad-box',
	//底部相关文字里面的热词提示
	'type_hot_word',
	//底部蓝色flex属性的广告栏+登录注册框
	'pulllog-box',
	//猜你喜欢（我不喜欢）
	"personalized-recommend-box",
	//发帖减半提示
	"totast-box", );

	//IDS
	var idList = new Array(
	// ****** 文章页 ******
	//广告
	"asideFooter", "ad-div", "479", "480",
	// ****** 论坛 ******
	//底部推荐
	"post_feed_wrap", );

	for (var i = 0; i < classList.length; i++) {
		var tempName = classList[i];
		$("." + tempName).remove();
	}

	for (var j = 0; j < idList.length; j++) {
		var tempID = idList[j];
		$("#" + tempID).remove();
	}
}