var str = `
    if ($.browser.msie) {//如果是IE，则定时回收内存
        window.setInterval("CollectGarbage();", 10000);
    }

    $(document).ready(function () {
        DWZ.init("https://wl.scutde.net:443/edu3/jscript/framework/dwz.plugin.xml", {
            callback: function () {
                initEnv();
                $("#themeList").theme({themeBase: "themes"});
            }
        });
        resizeLayout();

        //菜单
        menuFix();
        //初始化Ztree
        var zTree1;
        var setting = {checkable: false, expandSpeed: "", callback: {click: zTreeOnClick}};

        var zNodes = [{
            "name": "离散数学",
            "id": "402881382ea3cffc012ea411e76f0242,",
            "open": true,
            "level": 0,
            "nodes": [{
                "name": "第一章 命题逻辑",
                "id": "402881382f520988012f570fafdd0140,1",
                "open": true,
                "level": 1,
                "nodes": [{
                    "name": "第一节 命题与联结词",
                    "id": "402881382f520988012f571282680148,2",
                    "open": true,
                    "level": 2,
                    "parentId": "402881382f520988012f570fafdd0140",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第二节 命题公式",
                    "id": "402881382f520988012f5712a86b0149,2",
                    "open": true,
                    "level": 2,
                    "parentId": "402881382f520988012f570fafdd0140",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第三节 命题公式的范式",
                    "id": "402881382f520988012f5712c8b1014a,2",
                    "open": true,
                    "level": 2,
                    "parentId": "402881382f520988012f570fafdd0140",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第四节 联结词的功能完全集",
                    "id": "402881382f520988012f57134b8f014b,2",
                    "open": true,
                    "level": 2,
                    "parentId": "402881382f520988012f570fafdd0140",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第五节 推理规则和证明方法",
                    "id": "402881382f520988012f57136aa4014c,2",
                    "open": true,
                    "level": 2,
                    "parentId": "402881382f520988012f570fafdd0140",
                    "exAttribute": {"mate": "Y"}
                }],
                "parentId": "402881382ea3cffc012ea411e76f0242"
            }, {
                "name": "第二章 谓词逻辑",
                "id": "402881382f520988012f570fe4190141,1",
                "level": 1,
                "nodes": [{
                    "name": "第一节 谓词逻辑的基本概念",
                    "id": "402881382f520988012f5715ea250152,2",
                    "level": 2,
                    "parentId": "402881382f520988012f570fe4190141",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第二节 谓词逻辑公式",
                    "id": "402881382f520988012f5716373e0153,2",
                    "level": 2,
                    "parentId": "402881382f520988012f570fe4190141",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第三节 谓词演算的推理规则",
                    "id": "402881382f520988012f5716788a0154,2",
                    "level": 2,
                    "parentId": "402881382f520988012f570fe4190141",
                    "exAttribute": {"mate": "Y"}
                }],
                "parentId": "402881382ea3cffc012ea411e76f0242"
            }, {
                "name": "第三章 集合",
                "id": "402881382f520988012f57102a660142,1",
                "level": 1,
                "nodes": [{
                    "name": "第一节 集合的基本概念",
                    "id": "402881382f520988012f57198743015a,2",
                    "level": 2,
                    "parentId": "402881382f520988012f57102a660142",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第二节 集合的运算",
                    "id": "402881382f520988012f5719a46a015b,2",
                    "level": 2,
                    "parentId": "402881382f520988012f57102a660142",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第三节 归纳法与自然数",
                    "id": "402881382f520988012f5719d90d015c,2",
                    "level": 2,
                    "parentId": "402881382f520988012f57102a660142",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第四节 笛卡尔积",
                    "id": "402881382f520988012f571a52d9015d,2",
                    "level": 2,
                    "parentId": "402881382f520988012f57102a660142",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第五节 可数与不可数集合",
                    "id": "402881382f520988012f571a8148015e,2",
                    "level": 2,
                    "parentId": "402881382f520988012f57102a660142",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第六节 集合基数的比较",
                    "id": "402881382f520988012f571a9cb2015f,2",
                    "level": 2,
                    "parentId": "402881382f520988012f57102a660142",
                    "exAttribute": {"mate": "Y"}
                }],
                "parentId": "402881382ea3cffc012ea411e76f0242"
            }, {
                "name": "第四章 二元关系与函数",
                "id": "402881382f520988012f5710597e0143,1",
                "level": 1,
                "nodes": [{
                    "name": "第一节 二元关系的基本概念",
                    "id": "402881382f520988012f571e5fe30167,2",
                    "level": 2,
                    "parentId": "402881382f520988012f5710597e0143",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第二节 关系的合成",
                    "id": "402881382f520988012f571eb9bb0168,2",
                    "level": 2,
                    "parentId": "402881382f520988012f5710597e0143",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第三节 闭包",
                    "id": "402881382f520988012f571f31230169,2",
                    "level": 2,
                    "parentId": "402881382f520988012f5710597e0143",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第四节 偏序关系",
                    "id": "402881382f520988012f5720e35e016a,2",
                    "level": 2,
                    "parentId": "402881382f520988012f5710597e0143",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第五节 等价关系和划分",
                    "id": "ff8080816145c81801614aeb5c7000d8,2",
                    "level": 2,
                    "parentId": "402881382f520988012f5710597e0143",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第六节 函数的基本概念",
                    "id": "ff8080816145c81801614aeb7ba800d9,2",
                    "level": 2,
                    "parentId": "402881382f520988012f5710597e0143",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第七节 特殊 函数类",
                    "id": "ff8080816145c81801614aeeba3100da,2",
                    "level": 2,
                    "parentId": "402881382f520988012f5710597e0143",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第八节 逆函数",
                    "id": "ff8080816145c81801614aeed7c600db,2",
                    "level": 2,
                    "parentId": "402881382f520988012f5710597e0143",
                    "exAttribute": {"mate": "Y"}
                }],
                "parentId": "402881382ea3cffc012ea411e76f0242"
            }, {
                "name": "第五章 图论简介",
                "id": "402881382f520988012f57108fc30144,1",
                "level": 1,
                "nodes": [{
                    "name": "第一节 有向图及无向图",
                    "id": "402881382f520988012f5722d3f6016c,2",
                    "level": 2,
                    "parentId": "402881382f520988012f57108fc30144",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第二节 路径与回路",
                    "id": "402881382f520988012f5723d925016d,2",
                    "level": 2,
                    "parentId": "402881382f520988012f57108fc30144",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第三节 图的矩阵表示",
                    "id": "402881382f520988012f57240dc6016e,2",
                    "level": 2,
                    "parentId": "402881382f520988012f57108fc30144",
                    "exAttribute": {"mate": "Y"}
                }],
                "parentId": "402881382ea3cffc012ea411e76f0242"
            }, {
                "name": "第六章 特殊的图类",
                "id": "402881382f520988012f571126ca0145,1",
                "level": 1,
                "nodes": [{
                    "name": "第一节 二部图",
                    "id": "402881382f520988012f572864c10176,2",
                    "level": 2,
                    "parentId": "402881382f520988012f571126ca0145",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第二节 路径与回路",
                    "id": "402881382f520988012f5728848e0177,2",
                    "level": 2,
                    "parentId": "402881382f520988012f571126ca0145",
                    "exAttribute": {"mate": "Y"}
                }, {
                    "name": "第三节 树与有向树",
                    "id": "402881382f520988012f57289caa0178,2",
                    "level": 2,
                    "parentId": "402881382f520988012f571126ca0145",
                    "exAttribute": {"mate": "Y"}
                }],
                "parentId": "402881382ea3cffc012ea411e76f0242"
            }, {
                "name": "课程考点",
                "id": "4aa6636742db04d30142eac40c5a5496,1",
                "level": 1,
                "parentId": "402881382ea3cffc012ea411e76f0242"
            }, {
                "name": "随堂练习",
                "id": "4aa6636756e00aa70156e8dde9c86ec9,1",
                "level": 1,
                "parentId": "402881382ea3cffc012ea411e76f0242",
                "exAttribute": {"exam": "Y"}
            }]
        }];
        $(document).ready(function () {
            zTree1 = $("#syllabusTree").zTree(setting, zNodes);
        });

        function zTreeOnClick(event, treeId, treeNode) {
            var exAttribute = treeNode.exAttribute || {};
            //学习目标
            $("#interactive_tab1,#interactive_tab1Content").toggle(exAttribute['guid'] == 'Y');

            //学习材料
            $("#interactive_tab2,#interactive_tab2Content").toggle(exAttribute['mate'] == 'Y');

            //随堂练习
            $("#interactive_tab3,#interactive_tab3Content").toggle(exAttribute['exam'] == 'Y');

            //参考资料
            $("#interactive_tab4,#interactive_tab4Content").toggle(exAttribute['ref'] == 'Y');

            //if(treeNode.parentId!=""){
            $("#syllabusId").val(treeNode.id.split(",")[0]);
            //if(treeNode.id.split(",")[1]==1){
            $("#interactive_tab1").attr('href', "https://wl.scutde.net:443/edu3/edu3/learning/interactive/courselearningguid/list.html?syllabusId=" + treeNode.id.split(",")[0]);
            //}
            $("#interactive_tab2").attr('href', "https://wl.scutde.net:443/edu3/edu3/learning/interactive/materesource/list.html?syllabusId=" + treeNode.id.split(",")[0]);
            $("#interactive_tab3").attr('href', "https://wl.scutde.net:443/edu3/edu3/learning/interactive/activecourseexam/list.html?syllabusId=" + treeNode.id.split(",")[0]);
            $("#interactive_tab4").attr('href', "https://wl.scutde.net:443/edu3/edu3/learning/interactive/coursereference/list.html?syllabusId=" + treeNode.id.split(",")[0]);
            $("#interactive_tab5").attr('href', "https://wl.scutde.net:443/edu3/edu3/learning/interactive/bbstopic/list.html?teachType=networkstudy&courseId=FBECB1BCE761171EE030007F01001614&syllabusId=" + treeNode.id.split(",")[0]);
            $("[id^=interactive_tab]:visible:first").click();
            navTab._switchTab(0);
            $("#webContentFrame").attr("src", "");		//清空视频
            //}

        }

        //获取平时成绩积分
        getUsualResults();

        window.setTimeout(function () {
            if ($("#syllabusTree_2_a")) { //第一章
                $("#syllabusTree_2_a").click();
            }
        }, 500);

        window.setTimeout(getCourseNotice, 3000);//获取课程通知数量等信息

        getOnlieExam();
    });
    //var sidebarh;
    //全屏查看
    function fullScreen() {
        if ($("#header").height() == 118) {
            //sidebarh=$("#sidebar .accordionContent").height();
            $("#sidebar .toggleCollapse div").click();
            $("#header").hide();
            resizeLayout1();
            $("#hiddenTop").attr({title: "退出全屏查看"});
            $(window).resize();
            $("#webContentFrame").height($(".tabsContent").height());
            //$(".zTreeDemoBackground").height($("#sidebar_s").height()-46);
        } else {
            $("#sidebar_s .toggleCollapse div").click();
            $("#header").show();
            resizeLayout();
            $("#hiddenTop").attr({title: "全屏查看"});
            $(window).resize();
            //$("#sidebar .accordionContent").height(sidebarh);
            //$(".zTreeDemoBackground").height($("#sidebar_s").height()-46);
            $("#sidebar .accordionContent").height($("#sidebar_s").height() - 46);
            $("#webContentFrame").height($(".tabsContent").height());
        }
        $("#matesList").height($(".tabsContent").height() - 10);
    }

    function resizeLayout() {//重新调整框架布局
        $("#header").height("118px");
        $("#sidebar").css({width: 250});
        $("#leftside").css({top: 118});
        $("#container").css({top: 118, left: 260});
        $("#splitBar, #splitBarProxy").css({top: 118, left: 255});

        //$(".zTreeDemoBackground").height($("#container").height()-46);
    }

    function resizeLayout1() {//重新调整框架布局1
        $("#header").height(0);
        $("#sidebar").css({width: 250});
        $("#leftside").css({top: 0});
        $("#container").css({top: 0, left: 260});
        $("#splitBar, #splitBarProxy").css({top: 0, left: 255});

        //$(".zTreeDemoBackground").height($("#sidebar_s").height()-46);
    }

    var teachType = "networkstudy";

    //重新登录
    function relogin() {
        $.pdialog.open('https://wl.scutde.net:443/edu3/edu3/relogin.html?user=450106198906170510', 'relogin', '重新登录', {
            mask: true,
            width: 400,
            height: 180
        });
    }

    //课程概况
    function goCourseOverview(overviewId, typename) {
        var url = "https://wl.scutde.net:443/edu3/edu3/learning/interactive/courseoverview/view.html?overviewId=" + overviewId;
        navTab.openTab("navTab" + overviewId, url, typename);
    }

    //打开温馨提示
    function openCourseTips() {
        navTab.openTab("navTabCourseTips", "https://wl.scutde.net:443/edu3/edu3/learning/interactive/message/list.html?courseId=FBECB1BCE761171EE030007F01001614", "温馨提示");
    }

    //互动区-打开课程公告
    function openCourseNotice() {
        navTab.openTab("navTabCourseNotice", "https://wl.scutde.net:443/edu3/edu3/learning/interactive/coursenotice/list.html?courseId=FBECB1BCE761171EE030007F01001614", "课程公告");
    }

    //互动区-打开课程小组讨论
    function openCourseGroup() {
        if (teachType != 'netsidestudy') {
            window.open("https://wl.scutde.net:443/edu3/edu3/learning/bbs/section.html?courseId=FBECB1BCE761171EE030007F01001614&sectionId=402881382c3a07b8012c3a09471e0002", "newwindow");
        } else {
            alertMsg.warn("当前课程部分学习内容需面授，不允许进入此功能。");
        }

    }

    //互动区-打开课程论坛
    function openCourseBbs() {
        if (teachType != 'netsidestudy') {
            window.open('https://wl.scutde.net:443/edu3/edu3/learning/bbs/index.html?courseId=FBECB1BCE761171EE030007F01001614', 'course_bbs');
        } else {
            alertMsg.warn("当前课程部分学习内容需面授，不允许进入此功能。");
        }
    }

    //互动区-打开我要提问
    function openCourseAsk() {
        //$("#interactive_tab5").click();
        if (teachType != 'netsidestudy') {
            //首先进行提问时间间隔校验
            var courseId = 'FBECB1BCE761171EE030007F01001614';
            $.ajax({
                type: "POST",
                url: "https://wl.scutde.net:443/edu3/edu3/learning/interactive/bbstopic/checkTimeInterval.html",
                data: {courseId: courseId},
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (data.statusCode == 200) {
                        var isAllow = data.isAllow;
                        if (isAllow == true || isAllow == "true") {
                            $.pdialog.open(baseUrl + "/edu3/learning/interactive/bbstopic/ask.html?from=sidebar&courseId=FBECB1BCE761171EE030007F01001614&syllabusId=" + $('#syllabusId').val(), "dialogQuestion", "我要提问", {
                                height: 580,
                                width: 720
                            });
                        } else {
                            alertMsg.warn(data.message);
                        }
                    } else {
                        alertMsg.warn(data.message);
                    }
                }
            });
        } else {
            alertMsg.warn("当前课程部分学习内容需面授，不允许进入此功能。");
        }
    }

    //显示FAQ问题
    function goFAQ() {
        navTab.openTab("FAQ", "https://wl.scutde.net:443/edu3/edu3/learning/interactive/faq/list.html?courseId=FBECB1BCE761171EE030007F01001614", "FAQ问题");
    }

    //显示随堂练习分布以及完成情况
    function goQuizExercisesDistribution() {
        navTab.openTab("exerciseBatch", "https://wl.scutde.net:443/edu3/edu3/learning/exercise/practice-list.html?courseId=FBECB1BCE761171EE030007F01001614&flag=learn&examStatus=&isNeedexam=", "随堂练习分布");
    }

    //显示课程作业
    function goExerciseBatch() {
        navTab.openTab("exerciseBatch", "https://wl.scutde.net:443/edu3/edu3/learning/interactive/exercisebatch/list.html?courseId=FBECB1BCE761171EE030007F01001614", "课程作业");
    }

    //典型批改和优秀作业
    function goStudentExercise(type, name) {
        navTab.openTab(type, "https://wl.scutde.net:443/edu3/edu3/learning/interactive/studentexercise/list.html?courseId=FBECB1BCE761171EE030007F01001614&type=" + type, name);
    }

    //显示大作业
    function goBigHomeWork() {
        navTab.openTab("bigHomeWorkBatch", "https://wl.scutde.net:443/edu3/edu3/learning/interactive/bigHomeWorkbatch/list.html?courseId=FBECB1BCE761171EE030007F01001614", "大作业");
    }

    //模拟试题
    function goCourseMockTest() {
        var url = "https://wl.scutde.net:443/edu3/edu3/learning/interactive/coursemocktest/view.html?courseId=FBECB1BCE761171EE030007F01001614";
        navTab.openTab("CouseMockTest", url, "模拟试题");
    }

    //获取平时成绩积分
    function getUsualResults() {
        $.ajax({
            type: "POST",
            url: "https://wl.scutde.net:443/edu3/edu3/learning/interactive/usualresults/ajax.html",
            data: "courseId=FBECB1BCE761171EE030007F01001614&teachType=networkstudy",
            dataType: "json",
            global: false,
            success: function (data) {
                //$("#bbsResults").css("width",data.bbsResults+"%").parent().attr("title",data.bbsResults);
                $("#askQuestionResults").css("width", data.askQuestionResults + "%").parent().attr("title", data.askQuestionResults);
                $("#exerciseResults").css("width", data.exerciseResults + "%").parent().attr("title", data.exerciseResults);
                $("#courseExamResults").css("width", data.courseExamResults + "%").parent().attr("title", data.courseExamResults);
                $("#usualResults").css("width", data.usualResults + "%").parent().attr("title", data.usualResults);
                /*
            if(data.exerciseShow=='N'){
                 $("#exerciseResults").parent().parent().hide();
                } else {
                 $("#exerciseResults").parent().parent().show();
                }*/
            }
        });
    }

    //下拉菜单
    function menuFix() {
        var sfEls = document.getElementById("learning_nav").getElementsByTagName("li");
        for (var i = 0; i < sfEls.length; i++) {
            sfEls[i].onmouseover = function () {
                this.className += (this.className.length > 0 ? " " : "") + "sfhover";
            }
            sfEls[i].onMouseDown = function () {
                this.className += (this.className.length > 0 ? " " : "") + "sfhover";
            }
            sfEls[i].onMouseUp = function () {
                this.className += (this.className.length > 0 ? " " : "") + "sfhover";
            }
            sfEls[i].onmouseout = function () {
                this.className = this.className.replace(new RegExp("( ?|^)sfhover\\\\b"),
                    "");
            }
        }
    }

    //获取通知及其他数量
    function getCourseNotice() {
        $.ajax({
            type: "POST",
            url: "https://wl.scutde.net:443/edu3/edu3/framework/learning/getmsgcount.html",
            data: "courseId=FBECB1BCE761171EE030007F01001614",
            dataType: "json",
            global: false,
            success: function (data) {
                $("#_courseNoticeNum").html("(" + data.couseNoticeNum + ")");
            }
        });
    }

    function getOnlieExam() {
        $.ajax({
            type: "POST",
            url: "https://wl.scutde.net:443/edu3/edu3/framework/learning/onlieexam/ajax.html",
            data: "courseId=FBECB1BCE761171EE030007F01001614",
            dataType: "json",
            success: function (data) {
                if (data.isOpen && data.isOpen == 'Y') {
                    var examName = "在线考试";
                    if (data.isMachineExam == 'Y') {
                        examName = "期末考试";
                    }
                    if (data.isMachineExam != 'Y') {//只保留网考
                        $("#learning_nav").append("<li><a href='javascript:void(0)' onclick=\\"goOnlineExam('" + data.examUrl + "')\\">" + examName + "</a></li>");
                    }
                }
            }
        });
    }

    function goOnlineExam(examUrl) {
        $.ajax({
            type: "POST",
            url: "https://wl.scutde.net:443/edu3/edu3/framework/learning/onlieexam/findexamresult.html",
            data: "courseId=FBECB1BCE761171EE030007F01001614",
            dataType: "json",
            success: function (data) {
                if (data.isPass && data.isPass == 'Y') {
                    alertMsg.info(data.msg);
                }
                else {
                    var fromNet = 'pub';
                    var url = "http://";
                    url += examUrl + "/edu3-exam";
                    window.open(url + "/exam/main.html?sid=ff8080816532118b0165411b235d0883&cid=FBECB1BCE761171EE030007F01001614", "onlie_exam", "height=" + screen.availHeight + ",width=" + screen.availWidth + ",channelmode=yes,fullscreen=yes,top=0,left=0,toolbar=no,menubar=no,scrollbars=yes, resizable=no,location=no, status=no");


                }
            }
        });
    }`;

//取var zNodes之后第一对有效的中括号内的内容
let start = str.indexOf('var zNodes');
let end = start;
let left = 0;
let right = 0;
for (let i = start; i < str.length; i++) {
    //记录start
    if (str[i] === '[' && left === 0) {
        start = i
    }
    if (str[i] === '[') {
        left++;
    }
    if (str[i] === ']') {
        right++;
    }
    //记录end
    if (left === right && left !== 0) {
        end = i + 1;
        break
    }
}
console.log(start);
console.log(end);
let new_str = str.substring(start, end);
let tmpstr = JSON.stringify(new_str);
let obj = JSON.parse(tmpstr);
console.log(obj);
