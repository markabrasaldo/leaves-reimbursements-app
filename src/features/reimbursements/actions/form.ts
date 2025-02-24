'use server';

import getConfig from 'next/config';
import { FormState, schema } from './schema';
import { delay } from '@/constants/mock-api';

export async function submitForm(
  prevState: FormState,
  formData: FormData
): Promise<any> {
  const reimbursementFormData = Object.fromEntries(formData);

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

    const { publicRuntimeConfig } = getConfig();
    const baseUrl = publicRuntimeConfig.baseUrl;

    const payload = {
      organization_id: 'b39eddb6-dbe3-4822-8f23-361d6d4e3bdb',
      reimbursement_type_code: reimbursementFormData.reimbursementType,
      date: Date.now(),
      amount: reimbursementFormData.amount,
      status: 'DRAFT'
    };

    const response = await fetch(`${baseUrl}/api/${'ORG001'}/reimbursement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...payload })
    });

    const result = await response.json();

    await delay(1500);

    if (result) {
      return {
        status: 'ok',
        message: 'Sucess!',
        result
      };
    }
  }
}
