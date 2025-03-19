'use server';

import getConfig from 'next/config';
import { FormState, schema } from './schema';
import { getSessionDetails } from '@/app/utils/getSessionDetails';

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlReimbursement;

export async function submitForm(
  prevState: FormState,
  formData: FormData
): Promise<any> {
  const { accessToken, organization } = await getSessionDetails();

  const reimbursementFormData = Object.fromEntries(formData);

  const attachments = formData.getAll('files');

  const validatedReimbursementFormData = schema.safeParse(
    reimbursementFormData
  );

  if (!validatedReimbursementFormData.success) {
    const formFieldErrors =
      validatedReimbursementFormData.error.flatten().fieldErrors;

    if (formFieldErrors.amount || formFieldErrors.reimbursementType) {
      return {
        errors: {
          reimbursementType: formFieldErrors?.reimbursementType,
          amount: formFieldErrors?.amount
        }
      };
    }

    const isStatusDraft = reimbursementFormData?.status === 'DRAFT';

    const payload = {
      organization_id: organization?.id,
      reimbursement_type_code: reimbursementFormData.reimbursementType,
      date: new Date(Date.now()).toISOString(),
      amount: Number(reimbursementFormData.amount)
    };

    const response = await fetch(
      `${baseUrl}/${organization?.code}/reimbursement${isStatusDraft ? `/${reimbursementFormData?.leaveId}` : ''}`,
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
        formData: reimbursementFormData
      };
    }

    const uploadFormData = new FormData();

    attachments.forEach((file) => {
      uploadFormData.append('files', file);
    });

    const uploadPayload = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: uploadFormData
    };

    const uploadImageResponse = await fetch(
      `${baseUrl}/${organization?.code}/reimbursement/${result.data.id}/upload`,
      uploadPayload
    );

    const uploadImageResult = await uploadImageResponse.json();

    if (!uploadImageResponse.ok) {
      return {
        status: 'error',
        message: uploadImageResult.error,
        formData: reimbursementFormData
      };
    }

    return {
      status: 'success',
      message: result.message
    };
  }
}
