var images = require("images");

images("C:\\Users\\jf\\Desktop\\tupianceshi\\111.jpg")                     //Load image from file
//加载图像文件
    .size(400)                          //Geometric scaling the image to 400 pixels width
    //等比缩放图像到400像素宽
    // .draw(images("logo.png"), 10, 10)   //Drawn logo at coordinates (10,10)
    //在(10,10)处绘制Logo
    .save("C:\\Users\\jf\\Desktop\\tupianceshi\\111image.jpg", {               //Save the image to a file, with the quality of 50
        quality : 50                    //保存图片到文件,图片质量为50
    });