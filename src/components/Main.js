require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关数据
var imageDatas=require('../data/imageDatas.json');

//利用自执行函数 将图片名信息转成图片URL路径信息
imageDatas=(function genImageURL(imageDatasArr){
	for(var i=0;i<imageDatasArr.length;i++){
		var singleImageData=imageDatasArr[i];

		singleImageData.imageRUL=require('../images/'+singleImageData.filename);

		imageDatasArr[i]=singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

/*获取随即高低范围之间的值*/
function getRangeRandom(low,high){
  return Math.ceil(Math.random()*(high-low)+low);
}

/*获取0~30度之间的一个任意正负值*/
function get30DegRandom(){
  return ((Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30));
}

var ImgFigure=React.createClass({
 
  handleClick:function(e){
    if(this.props.arrange.isCenter){
        this.props.inverse();
    }else{
      this.props.center();
    }
    
    e.stopPropagation();
    e.preventDefault();
  },

	render:function(){
    var styleObj={};
    // 如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }
    // 如果图片的旋转角度有值并且不为0， 添加旋转角度
    if(this.props.arrange.rotate){
      (['MozT', 'msT', 'WebkitT', 't']).forEach(function (value) {
                     styleObj[value + 'ransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
                 }.bind(this));
    }
    // 如果是居中的图片， z-index设为11
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName='img-figure';
        imgFigureClassName+=this.props.arrange.isInverse?' is-inverse':'';

		return (
			<figure className={imgFigureClassName}  style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageRUL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
				</figcaption>
			</figure>
		)
	}
})
/*控制组件*/

var ControllerUnit=React.createClass({
    handleClick:function(e){
      if(this.props.arrange.isCenter){
        this.props.inverse();
      }
      else{
        this.props.center();
      }
      e.stopPropagation;
      e.preventDefault;
    },
    render:function(){
        var controllerUnitClassName='controller-unit';
        if(this.props.arrange.isCenter){
            controllerUnitClassName+=' is-center';
            if(this.props.arrange.isInverse){
              controllerUnitClassName+=' is-inverse';
            }
        }
        return(
          <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        )
    }
})

var AppComponent =React.createClass({
  	//设置图片放置的位置区域
    Constant:{
    	centerPos:{
    		left:0,
    		right:0
    	},
    	hPosRange:{
    		leftSecx:[0,0],
    		rightSecx:[0,0],
    		y:[0,0]
    	},
    	vPosRange:{
    		x:[0,0],
    		topY:[0,0]
    	}
    },

  //重新布局所有图片
    /*
      利用闭包函数返回排布位置的函数
    */
    center:function(index){
      return function(){
        this.rearrange(index);
      }.bind(this)
    },

    /*翻转图片
      
    */
    inverse:function(index){
      return function(){
          var imgsArrangeArr=this.state.imgsArrangeArr;

          imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;

          this.setState({
            imgsArrangeArr:imgsArrangeArr
          });
      }.bind(this)
    },


  	rearrange:function(centerIndex){
        var imgsArrangeArr=this.state.imgsArrangeArr,
        Constant=this.Constant,
        centerPos=Constant.centerPos,
        hPosRange=Constant.hPosRange,
        vPosRange=Constant.vPosRange,
        hPosRangeLeftSecx=hPosRange.leftSecx,
        hPosRangeRightSecx=hPosRange.rightSecx,
        hPosRangeY=hPosRange.y,
        vPosRangeTopY=vPosRange.topY,
        vPosRangeX=vPosRange.x,

        imgsArrangeTopArr=[],
        topImgNum=Math.floor(Math.random()*2),
        topImgSpliceIndex=0,

        imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);


        //居中centerIndex的图片
        imgsArrangeCenterArr[0]={
          pos:centerPos,
          rotate:0,
          isCenter:true
        }

        //取出上册图片的状态信息
        topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
        imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index]={
            pos:{
              top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          };
        });
        //布局左右两侧图片
        for(var i=0;i<imgsArrangeArr.length;i++){
          var hPosRangeLORX=null;
          if(i<imgsArrangeArr.length/2){
            hPosRangeLORX=hPosRangeLeftSecx;
          }else{
            hPosRangeLORX=hPosRangeRightSecx;
          }
          imgsArrangeArr[i]={
            pos:{
              top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          };
        }

        if(imgsArrangeTopArr&&imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
  
        this.setState({
          imgsArrangeArr:imgsArrangeArr
        });

  	},

    getInitialState:function(){
      return {
        imgsArrangeArr:[
          // {
          //   pos:{
          //     left:'0',
          //     top:'0'
          //   },
                // rotate:0, //旋转角度
                /*isInverse:false ,  图片正反面*/
              /*  isCenter:false,  图片是否居中*/
          // }
        ]
      }
    },

    // 为每张图片计算其位置的范围
    componentDidMount:function(){
    	//首先拿到舞台的大小
    	var stageDOM=ReactDOM.findDOMNode(this.refs.stage),
    		stageW=stageDOM.scrollWidth,
    		stageH=stageDOM.scrollHeight,
    		halfStageW=Math.ceil(stageW/2),
    		halfStageH=Math.ceil(stageH/2);
    	//拿到一个imageFigure的大小
    	var imgFigureDOM=ReactDOM.findDOMNode(this.refs.imgFigure0),//需要引入react-dom模块
      	 	imgW=imgFigureDOM.scrollWidth,
      	 	imgH=imgFigureDOM.scrollHeight,
      	 	halfImageW=Math.ceil(imgW/2),
      	 	halfImageH=Math.ceil(imgH/2);

    // 	 	//计算区域图片排布位置的取值范围
    	 this.Constant.centerPos={
    	 	left:halfStageW-halfImageW,
    	 	top:halfStageH-halfImageH
    	 }
       this.Constant.hPosRange.leftSecx[0]=-halfImageW;
    	 this.Constant.hPosRange.leftSecx[1]=halfStageW-halfImageW*3;
    	 this.Constant.hPosRange.rightSecx[0]=halfStageW+halfImageW;
    	 this.Constant.hPosRange.rightSecx[1]=stageW-halfImageW;
    	 this.Constant.hPosRange.y[0]=-halfImageH;
    	 this.Constant.hPosRange.y[1]=stageH-halfImageH

    	 this.Constant.vPosRange.topY[0]=-halfImageH;
    	 this.Constant.vPosRange.topY[1]=halfStageH-halfImageH*3;
    	 this.Constant.vPosRange.x[0]=halfStageW-imgW;
    	 this.Constant.vPosRange.x[1]=halfStageW;
    	 this.rearrange(0);
    },

    render : function() {
    	var ControllerUnits=[],imgFigures=[];
    	imageDatas.forEach(function(value,index){
        if(!this.state.imgsArrangeArr[index]){
          this.state.imgsArrangeArr[index]={
            pos:{
              left:0,
              top:0
            },
            rotate:0,
            isInverse:false,
            isCenter:false
          };
        }
        // console.log(this.state.imgsArrangeArr);
    		imgFigures.push(<ImgFigure  key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    	  ControllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
      }.bind(this));
        
      return (
        <section className="stage" ref="stage">
        	<section className="img-sec">
        		{imgFigures}
        	</section>
        	<nav className="controller-nav">
            {ControllerUnits}
        	</nav>
        </section>
      );
    }
})

AppComponent.defaultProps = {
};

export default AppComponent;
