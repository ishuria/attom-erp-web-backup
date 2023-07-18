<script lang="ts" setup>
  defineOptions({
    name: 'Redirect',
  })

  onMounted(() => {
    setTimeout(() => {
      history.back()
    }, 500)
  })
</script>
