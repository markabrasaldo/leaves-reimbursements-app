import { notFound } from 'next/navigation';
import ReimbursementForm from './reimbursement-form';
import { Reimbursement } from '../types';

type TReimbursementViewPageProps = {
  reimbursementId: string;
};

async function getReimbursementById(reimbursementId: string) {
  try {
    const response = await fetch(
      // `${baseUrl}/${organization_code}/reimbursement/${reimbursementId}` // when endpoint is available
      `http://localhost:3000/api/ORG001/reimbursement/${reimbursementId}`
    );

    const reimbursement = await response.json();

    return {
      reimbursement
    };
  } catch (error) {
    throw new Error('Failed to fetch reimbursement by Id');
  }
}

export default async function TReimbursementViewPageProps({
  reimbursementId
}: TReimbursementViewPageProps) {
  let reimbursement = null;
  let pageTitle = 'Create New Reimbursement';

  if (reimbursementId !== 'new') {
    //change fetching of data
    const data = await getReimbursementById(reimbursementId);

    reimbursement = data.reimbursement as Reimbursement;
    if (!reimbursement) {
      notFound();
    }
    pageTitle = `Edit Reimbursement`;
  }

  //change form
  return (
    <ReimbursementForm initialData={reimbursement} pageTitle={pageTitle} />
  );
}
