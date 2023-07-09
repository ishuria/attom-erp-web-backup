<template>
  <div class="custom-tree-node-container">
    <el-tree
      :data="data"
      default-expand-all
      :expand-on-click-node="false"
      node-key="id"
      :props="{ class: customNodeClass }"
      show-checkbox
    />
  </div>
</template>

<script lang="ts" setup>
  interface Tree {
    id: number
    label: string
    isPenultimate?: boolean
    children?: Tree[]
  }

  const customNodeClass: any = (data: Tree) => {
    if (data.isPenultimate) {
      return 'is-penultimate'
    }
    return null
  }

  const data: Tree[] = [
    {
      id: 1,
      label: 'Level one 1',
      children: [
        {
          id: 4,
          label: 'Level two 1-1',
          isPenultimate: true,
          children: [
            {
              id: 9,
              label: 'Level three 1-1-1',
            },
            {
              id: 10,
              label: 'Level three 1-1-2',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      label: 'Level one 2',
      isPenultimate: true,
      children: [
        {
          id: 5,
          label: 'Level two 2-1',
        },
        {
          id: 6,
          label: 'Level two 2-2',
        },
      ],
    },
    {
      id: 3,
      label: 'Level one 3',
      isPenultimate: true,
      children: [
        {
          id: 7,
          label: 'Level two 3-1',
        },
        {
          id: 8,
          label: 'Level two 3-2',
        },
      ],
    },
  ]
</script>

<style>
  .is-penultimate > .el-tree-node__content {
    color: #626aef;
  }

  .el-tree-node.is-expanded.is-penultimate > .el-tree-node__children {
    display: flex;
    flex-direction: row;
  }

  .is-penultimate > .el-tree-node__children > div {
    width: 25%;
  }
</style>
