<template>
  <table class="table">
    <tr>
      <td v-for="(item, i) in columns" :key="i" class="center">{{ item.label }}</td>
    </tr>
    <tr v-for="(item, i) in data" :key="i" @click="handleTrClick(item)">
      <td v-for="(_item, _i) in columns" :key="_i" class="data-text">
        <TRender v-if="_item.render" :render-fn="_item.render" :row="item"></TRender>
        <span v-else>{{ item[_item.prop] }}</span>
      </td>
    </tr>
    <tr>
      <td :colspan="columns.length" v-if="data.length === 0" class="data-text">
        暂无数据
      </td>
    </tr>
  </table>
</template>

<script>
const TRender = {
  props: {
    renderFn: Function,
    row: Object
  },
  render(h) {
    return this.renderFn(h, this.row)
  }
}
export default {
  name: "Table",
  props: {
    columns: Array,
    data: Array
  },
  components: { TRender },
  methods: {
    handleTrClick(item) {
      this.$emit('trClick', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
}
.center {
  padding: 6px 0;
  text-align: center;
}
.data-text {
  padding: 6px 0;
  text-align: center;
  color: #999;
}
</style>