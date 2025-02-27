import { toast } from 'sonner';

interface ActionState {
  status: string;
  message: any;
}

export function toastUtil(state: ActionState) {
  let toastType;

  switch (state.status) {
    case 'error':
      toastType = toast.error(state.message);
      break;

    case 'success':
      toastType = toast.success(state.message);
      break;

    default:
      break;
  }

  return toastType;
}
