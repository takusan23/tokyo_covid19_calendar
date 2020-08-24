<template>
  <!-- グラフ -->
  <!-- propsのchartDataにはMap<String,number>を入れてください。keyが下のラベル、valueが数値になります -->
  <canvas width="200" height="200" id="chart"></canvas>
</template>

<script lang="ts">
import Vue from "vue";
import Chart from "chart.js"; // グラフ

export default Vue.extend({
  props: ["chartData"],
  data: () => ({}),
  watch: {
    // 作成直後はchartDataは空っぽなので
    chartData: (
      newValue: Map<string, number>,
      oldValue: Map<string, number>
    ) => {
      // グラフ
      const ctx = <HTMLCanvasElement>document.getElementById("chart");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Array.from(newValue.keys()),
          datasets: [
            {
              label: "感染者数",
              data: Array.from(newValue.values()),
              backgroundColor: "rgba(255, 99, 132, 1)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    },
  },
});
</script>