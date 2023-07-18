<script lang="ts" setup>
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import theme from './theme/vab-echarts-theme.json'
  import { use } from 'echarts/core'
  import { SVGRenderer, CanvasRenderer } from 'echarts/renderers'
  import {
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    RadarChart,
    MapChart,
    TreeChart,
    TreemapChart,
    GraphChart,
    GaugeChart,
    FunnelChart,
    ParallelChart,
    SankeyChart,
    BoxplotChart,
    CandlestickChart,
    EffectScatterChart,
    LinesChart,
    HeatmapChart,
    PictorialBarChart,
    ThemeRiverChart,
    SunburstChart,
    CustomChart,
  } from 'echarts/charts'
  import {
    GridComponent,
    PolarComponent,
    GeoComponent,
    SingleAxisComponent,
    ParallelComponent,
    CalendarComponent,
    GraphicComponent,
    ToolboxComponent,
    TooltipComponent,
    AxisPointerComponent,
    BrushComponent,
    TitleComponent,
    TimelineComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
    LegendComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent,
    VisualMapComponent,
    VisualMapContinuousComponent,
    VisualMapPiecewiseComponent,
    AriaComponent,
    DatasetComponent,
    TransformComponent,
  } from 'echarts/components'
  import VChart, { THEME_KEY } from 'vue-echarts'

  defineOptions({
    name: 'VabChart',
  })

  const props = defineProps({
    option: {
      type: Object,
      default: () => {},
    },
    autoresize: {
      type: Boolean,
      default: true,
    },
    renderer: {
      type: String,
      default: () => {
        return 'CanvasRenderer'
      },
    },
  })

  const VChartRef = ref<any>(null)

  use([
    props.renderer === 'CanvasRenderer' ? CanvasRenderer : SVGRenderer,
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    RadarChart,
    MapChart,
    TreeChart,
    TreemapChart,
    GraphChart,
    GaugeChart,
    FunnelChart,
    ParallelChart,
    SankeyChart,
    BoxplotChart,
    CandlestickChart,
    EffectScatterChart,
    LinesChart,
    HeatmapChart,
    PictorialBarChart,
    ThemeRiverChart,
    SunburstChart,
    CustomChart,
    GridComponent,
    PolarComponent,
    GeoComponent,
    SingleAxisComponent,
    ParallelComponent,
    CalendarComponent,
    GraphicComponent,
    ToolboxComponent,
    TooltipComponent,
    AxisPointerComponent,
    BrushComponent,
    TitleComponent,
    TimelineComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
    LegendComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent,
    VisualMapComponent,
    VisualMapContinuousComponent,
    VisualMapPiecewiseComponent,
    AriaComponent,
    DatasetComponent,
    TransformComponent,
  ])

  provide(THEME_KEY, theme)

  const handleHighlight = (action: any) => {
    return action
  }

  const handleClick = (event: any) => {
    return event
  }

  const resize = () => {
    VChartRef.value.resize()
  }

  const clear = () => {
    VChartRef.value.clear()
  }

  const dispose = () => {
    VChartRef.value.dispose()
  }

  const getWidth = () => {
    return VChartRef.value.getWidth()
  }

  const getHeight = () => {
    return VChartRef.value.getHeight()
  }
</script>

<template>
  <v-chart
    ref="VChartRef"
    :autoresize="autoresize"
    :option="option"
    @click="handleClick"
    @highlight="handleHighlight"
  />
</template>
