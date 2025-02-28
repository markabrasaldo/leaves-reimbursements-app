'use server';

import getConfig from 'next/config';
import { schema } from './schema';
import { getSessionDetails } from '@/app/utils/getSessionDetails';
import { revalidatePath } from 'next/cache';

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlLeave;

export async function submitForm(_prevState: any, formData: FormData) {
  const { accessToken, organization, user_id } = await getSessionDetails();

  const leavesFormData = Object.fromEntries(formData);

  const validatedLeaveFormData = schema.safeParse(leavesFormData);

  if (!validatedLeaveFormData.success) {
    const formFieldErrors = validatedLeaveFormData.error.flatten().fieldErrors;

    return {
      error: {
        startDate: formFieldErrors?.startDate?.[0],
        endDate: formFieldErrors?.endDate?.[0],
        leaveType: formFieldErrors?.leaveType?.[0]
      }
    };
  }

  const isStatusDraft = leavesFormData?.status === 'DRAFT';

  const payload = {
    ...(!isStatusDraft && { user_id }),
    leave_type_id: leavesFormData.leaveType,
    start_date: leavesFormData.startDate,
    end_date: leavesFormData.endDate,
    remarks: leavesFormData.remarks
  };

  const response = await fetch(
    `${baseUrl}/${organization?.code}/leaves${isStatusDraft ? `/${leavesFormData?.leaveId}` : ''}`,
    {
      method: isStatusDraft ? 'PUT' : 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...payload })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return {
      status: 'error',
      message: result.error,
      formData: leavesFormData
    };
  }

  revalidatePath('/dashboard/leave/:id');

  return {
    status: 'success',
    message: result.message
  };
}

export async function leaveAction(_prevState: any, formData: FormData) {
  const { accessToken, organization, leave_balances } =
    await getSessionDetails();

  const leaveActionFormData = Object.fromEntries(formData);

  const response = await fetch(
    `${baseUrl}/${organization?.code}/leaves/${leaveActionFormData.leaveId}/${leaveActionFormData.action}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return {
      status: 'error',
      message: result.error
    };
  }

  return {
    status: 'success',
    message: result.message
  };
}
