/**
 * 存储新品订货步骤 reviewId -> stepNo
 */
export const useStepNoState = defineStore('stepNo', {
  state: (): StepNoState => ({
    stepNoMap: new Map<number, number>(),
  }),
  actions: {
    setStepNo(reviewId: number, stepNo: number) {
      this.stepNoMap.set(reviewId, stepNo)
      // console.log('set:', this.stepNoMap)
    },
    getStepNo(reviewId: number) {
      // console.log('get:', this.stepNoMap)
      return this.stepNoMap.get(reviewId) || 0
    },
  },
})
