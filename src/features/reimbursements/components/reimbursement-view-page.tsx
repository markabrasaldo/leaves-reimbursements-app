import { fakeReimbursements } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import ReimbursementForm from './reimbursement-form';
import { Reimbursement } from '../types';
import { ReimbursementType } from '../utils/reimbursement-store';

type TReimbursementViewPageProps = {
  reimbursementTypesData: ReimbursementType[];
  reimbursementId: string;
};

// use when endpoint is available
async function getReimbursements(reimbursementId: number) {
  // const { publicRuntimeConfig } = getConfig();
  // const baseUrl = publicRuntimeConfig.baseUrl;
  // const res = await fetch(`${baseUrl}/${organization_code}/reimbursements/`);

  const response = await fakeReimbursements.getReimbursementListById(
    Number(reimbursementId)
  );

  return {
    reimbursement: response
  };
}

export default async function TReimbursementViewPageProps({
  reimbursementTypesData,
  reimbursementId
}: TReimbursementViewPageProps) {
  let reimbursement = null;
  let pageTitle = 'Create New Reimbursement';

  if (reimbursementId !== 'new') {
    //change fetching of data
    const data = await getReimbursements(reimbursementId);

    reimbursement = data.reimbursement as Reimbursement;
    if (!reimbursement) {
      notFound();
    }
    pageTitle = `Edit Reimbursement`;
  }

  //change form
  return (
    <ReimbursementForm
      reimbursementTypesData={reimbursementTypesData}
      initialData={reimbursement}
      pageTitle={pageTitle}
    />
  );
}
