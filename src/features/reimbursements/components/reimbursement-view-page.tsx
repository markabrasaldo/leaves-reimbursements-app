import { notFound } from 'next/navigation';
import ReimbursementForm from './reimbursement-form';
import { Reimbursement } from '../types';
import { ReimbursementType } from '../utils/reimbursement-store';
import getConfig from 'next/config';
import { getSessionDetails } from '@/app/utils/getSessionDetails';

type TReimbursementViewPageProps = {
  reimbursementTypesData: ReimbursementType[];
  reimbursementId: string;
};
const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlReimbursement;

async function getReimbursementById(reimbursementId: string) {
  const { accessToken, organization } = await getSessionDetails();

  const response = await fetch(
    `${baseUrl}/${organization?.code}/reimbursement/${reimbursementId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const reimbursement = await response.json();

  if (!response.ok) {
    throw new Error(reimbursement.error || 'Failed to fetch reimbursementId');
  }

  const { data, message } = reimbursement;

  return {
    data,
    message
  };
}

export default async function TReimbursementViewPageProps({
  reimbursementTypesData,
  reimbursementId
}: TReimbursementViewPageProps) {
  let reimbursement = null;
  let pageTitle = 'Create New Reimbursement';

  if (reimbursementId !== 'new') {
    const { data, message } = await getReimbursementById(reimbursementId);

    reimbursement = data as Reimbursement;
    if (!reimbursement) {
      notFound();
    }
    pageTitle = `Edit Reimbursement`;
  }

  return (
    <ReimbursementForm
      reimbursementTypesData={reimbursementTypesData}
      initialData={reimbursement}
      pageTitle={pageTitle}
    />
  );
}
