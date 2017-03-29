/**
 * Created by zhanglin on 2017/3/29.
 */

import React, {
    Component ,
    PropTypes
} from 'react';

import {View, Image, Text,StyleSheet,TouchableOpacity,Dimensions,PanResponder,ART} from 'react-native';

var deviceWidth = Dimensions.get('window').width;

const {Surface, Shape, Path} = ART;
const Margin = 10;//间距
const ThumbWidth = 60;//滑块内容宽度
const LineWidth = deviceWidth - Margin*2 - ThumbWidth; //滑块横线宽度
const DegreeWidth = 16; //刻度尺下面显示的文字的宽度
const ArrowWidth = 6; //小箭头宽度
const ArrowHeight =4; //小箭头高度

class CostumSlider extends React.Component {

    static propTypes = {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        sep: PropTypes.number,
        icon: PropTypes.string,
        unit: PropTypes.string,
        title: PropTypes.string,
    }


    static get defaultProps() {
        return {
            min: 1,
            max: 100,
            sep: 1,
            icon: require('../image/1234.png'),
            unit: '岁',
            title: '请选择宝宝年龄',
        }
    }

    constructor(props) {
        super(props);
        this.state={
            left:0,//距离左边的位置
            value:this.props.min,//默认当前值
        };


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


                if(newLeft<0){ //如果滑块已经滑到最左边  则不能继续向左滑动
                    newLeft = 0;
                    newValue = this.props.min;
                }else if(newLeft>LineWidth){  //如果滑块已经滑到最右边，则不能继续向右滑动
                    newLeft = LineWidth ;
                    newValue = this.props.max;
                }else {
                    if(newLeft%(LineWidth/space)>=(LineWidth/space)*0.8){  //如果当前滑块快接近到下一个刻度  则直接移动到下一个刻度
                        newValue = this.props.min + Math.ceil(newLeft/(LineWidth/space)*this.props.sep);
                        newLeft = (LineWidth/space) * ((newValue-this.props.min)/this.props.sep);
                    }else if(newLeft%(LineWidth/space)<=(LineWidth/space)*0.2){  //如果当前滑块快接近到上一个刻度  则直接移动到上一个刻度
                        newValue = this.props.min + Math.floor(newLeft/(LineWidth/space)*this.props.sep);
                        newLeft = (LineWidth/space) * ((newValue-this.props.min)/this.props.sep);
                    }else {return;}  //如果滑动处在两个刻度20%~80%之间  则不移动当前滑块
                }

                this.setState({
                    left: newLeft,
                    value:newValue,
                })
            },

        })
    }

    render() {

        const path = new Path()
            .moveTo(0,0)
            .lineTo(ArrowWidth,0)
            .lineTo(ArrowWidth/2,ArrowHeight)
            .close();

        return (
            <View style={[styles.container,this.props.style]}>
                {/* 显示提示词  例如  请选择宝宝年龄 */}
                <Text style={styles.title}>{this.props.title}</Text>
                {/* 显示滑动头部试图  左侧显示小图标  右侧显示当前值  值带单位  例如 '3岁' */}
                <View style={[styles.thumbView,{left:this.state.left}]}  {...this._panResponder.panHandlers}>
                    <Image style={styles.image} source={this.props.icon}/>
                    <Text style={styles.content}>{this.state.value}{this.props.unit}</Text>
                </View>
                <View style={{marginBottom:10,left:this.state.left+(ThumbWidth-ArrowWidth)/2}}>
                    <Surface width={ArrowWidth} height={ArrowHeight}>
                        <Shape d={path}  fill="#fb4b88"  />
                    </Surface>
                </View>
                {/* 显示整个滑块条长度 */}
                <View style={styles.sliderView}>
                    {/* 显示已滑动的长度 */}
                    <View style={[styles.sliderChildView,{width:this.state.left}]}></View>
                </View>
                {/* 显示刻度尺 */}
                <View style={styles.degreeView}>
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
        flex:1,
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
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:15,
        padding:5,
        width:ThumbWidth,
        height:35,
        backgroundColor:'#fb4b88',
        borderRadius:35/2.0,
        overflow:'hidden',
    },
    image: {
        resizeMode:'cover',
        width:25,
        height:25,
        marginRight:3,
    },
    content: {
        fontSize:12,
        color:'white',
    },
    sliderView:{
        height:6,
        borderRadius:3,
        overflow:'hidden',
        backgroundColor:'#e0e0e0',
        marginLeft:ThumbWidth/2,
        marginRight:ThumbWidth/2,
    },
    sliderChildView:{
        flex:1,
        backgroundColor:'#fb4b88',
    },
    degreeView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:10,
        marginLeft:(ThumbWidth-DegreeWidth)/2,
        marginRight:(ThumbWidth-DegreeWidth)/2,
        marginBottom:5,
    },
    degreeText:{
        fontSize: 12,
        color:'#222222',
        width:DegreeWidth,
        textAlign:'center'
    },


});