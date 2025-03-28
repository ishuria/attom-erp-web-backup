import { useStepNoState } from "/@/store/modules/stepNoState"

const stepNoStore = useStepNoState();

export const _setStepNo = (reviewId: number, stepNo: number) => {
  stepNoStore.setStepNo(reviewId, stepNo); 
}
export const _getStepNo = (reviewId: number) => {
  return stepNoStore.getStepNo(reviewId);
}