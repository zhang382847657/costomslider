/**
 * Created by zhanglin on 2017/3/29.
 */

import React, {
    Component ,
    PropTypes
} from 'react';

import {View, Image, Text,StyleSheet,TouchableOpacity,Dimensions,PanResponder} from 'react-native';
var deviceWidth = Dimensions.get('window').width;

const Margin = 10;//间距
const DegreeWidth = 16; //刻度尺下面显示的文字的宽度

var imageWidth = 0; //图片宽度
var imageHeight = 0; //图片高度
var lineWidth = 0; //滑块横线宽度
var icon; //滑块显示的图片

class CostumSlider extends React.Component {

    static propTypes = {
        min: PropTypes.number.isRequired, //最小值
        max: PropTypes.number.isRequired, //最大值
        sep: PropTypes.number, //歩长
        type: PropTypes.string, //类型 'baby' ||  'money'
        unit: PropTypes.string, //显示单位
        title: PropTypes.string, //提示语
    }


    static get defaultProps() {
        return {
            min: 1,
            max: 34,
            sep: 3,
            type: 'baby',
            unit: '周',
            title: '请选择宝宝年龄',
        }
    }

    constructor(props) {
        super(props);
        this.state={
            left:0,//距离左边的位置
            value:this.props.min,//默认当前值
        };

        this._initConfig = this._initConfig.bind(this);

    }

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: ()=> true,
            onPanResponderGrant: ()=>{
                this._left = this.state.left
            },
            onPanResponderMove: (evt,gs)=>{  //监听滑块移动

                let space = (this.props.max - this.props.min) / this.props.sep; //刻度之间一共有多少个间隔
                let newLeft = this._left+gs.dx;//距离左边的间距
                let newValue = this.props.min;//滑块上方显示的值


                console.log("aaaaa"+lineWidth);
                if(newLeft<0){ //如果滑块已经滑到最左边  则不能继续向左滑动
                    newLeft = 0;
                    newValue = this.props.min;
                }else if(newLeft>lineWidth){  //如果滑块已经滑到最右边，则不能继续向右滑动
                    newLeft = lineWidth ;
                    newValue = this.props.max;
                }else {
                    if(newLeft%(lineWidth/space)>=(lineWidth/space)*0.8){  //如果当前滑块快接近到下一个刻度  则直接移动到下一个刻度
                        newValue = this.props.min + Math.ceil(newLeft/(lineWidth/space)*this.props.sep);
                        newLeft = (lineWidth/space) * ((newValue-this.props.min)/this.props.sep);
                    }else if(newLeft%(lineWidth/space)<=(lineWidth/space)*0.2){  //如果当前滑块快接近到上一个刻度  则直接移动到上一个刻度
                        newValue = this.props.min + Math.floor(newLeft/(lineWidth/space)*this.props.sep);
                        newLeft = (lineWidth/space) * ((newValue-this.props.min)/this.props.sep);
                    }else {return;}  //如果滑动处在两个刻度20%~80%之间  则不移动当前滑块
                }

                this.setState({
                    left: newLeft,
                    value:newValue,
                })
            },

        })
    }


    ////////初始化配置/////////
    _initConfig(){

        if(this.props.type == 'baby'){
            icon = require('../image/baby.png'),
            imageWidth=60; //图片宽度
            imageHeight=35; //图片高度
            lineWidth=deviceWidth - Margin*2 - 60;//滑块宽度
        }else if(this.props.type == 'money'){
            icon = require('../image/money.png'),
            imageWidth=76; //图片宽度
            imageHeight=35; //图片高度
            lineWidth=deviceWidth - Margin*2 - 76;//滑块宽度
        }
    }



    render() {

        this._initConfig();

        return (
            <View style={[styles.container,this.props.style]}>
                {/* 显示提示词  例如  请选择宝宝年龄 */}
                <Text style={styles.title}>{this.props.title}</Text>
                {/* 显示滑动头部视图   背景图+当前值 值带单位  例如 '3岁' */}
                <Image  source={icon} style={[styles.thumbView,{left:this.state.left}]}  {...this._panResponder.panHandlers}>
                    <Text style={styles.content}>{this.state.value}{this.props.unit}</Text>
                </Image>
                {/* 显示整个滑块条长度 */}
                <View style={[styles.sliderView,{marginLeft:imageWidth/2,marginRight:imageWidth/2,}]}>
                    {/* 显示已滑动的长度 */}
                    <View style={[styles.sliderChildView,{width:this.state.left}]}></View>
                </View>
                {/* 显示刻度尺 */}
                <View style={[styles.degreeView,{marginLeft:(imageWidth-DegreeWidth)/2, marginRight:(imageWidth-DegreeWidth)/2,}]}>
                    {this._addDegree()}
                </View>
            </View>

        );
    }

    //添加刻度尺
    _addDegree(){
        var pointCount = (this.props.max - this.props.min) / this.props.sep + 1;//刻度尺点的个数
        var tmp = this.props.min;
        var array = new Array(pointCount).fill(0);
        let that= this;
        return array.map(function (item,index) {
            let empty = tmp;
            tmp += that.props.sep;
            return(
                <Text key={index} style={styles.degreeText}>{empty}</Text>
            );
        });


    }



}

module.exports = CostumSlider;

const styles = StyleSheet.create({
    container:{
        padding:Margin,
        backgroundColor: 'white',
    },
    title:{
        marginTop:5,
        fontSize:12,
        color:'#222222',
        textAlign:'center',
    },
    thumbView:{
        marginTop:15,
        marginBottom:10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        left:12,
        marginBottom:3,
        fontSize:12,
        color:'white',
        backgroundColor:'transparent',
    },
    sliderView:{
        height:6,
        borderRadius:3,
        overflow:'hidden',
        backgroundColor:'#e0e0e0',

    },
    sliderChildView:{
        flex:1,
        backgroundColor:'#fb4b88',
        borderRadius:3,
    },
    degreeView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:10,
        marginBottom:5,
    },
    degreeText:{
        fontSize: 12,
        color:'#222222',
        width:DegreeWidth,
        textAlign:'center'
    },


});