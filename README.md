# costomslider
自定义滑块效果（带刻度）

> ### 使用方法
```
<CostumSlider style={{marginTop:60}}
              min={10} //最小值
              max={20} //最大值
              sep={2}  //步长
              title={'请选择心里价位'} //标题
              unit={'元/月'}  //单位
              type={'money'|'baby'}  //类型 两种money或baby对应的是价位和宝宝年龄
              currentValue={(value)=>{console.log("当前值是=="+value)}}  //当前值的回调
              defaultValue={12} //默认选中的值
/>
```
