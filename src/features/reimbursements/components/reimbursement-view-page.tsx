import { fakeProducts, Product } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';

type TReimbursementViewPageProps = {
  reimbursementId: string;
};

export default async function TReimbursementViewPageProps({
  reimbursementId
}: TReimbursementViewPageProps) {
  let reimbursement = null;
  let pageTitle = 'Create New Reimbursement';

  if (reimbursementId !== 'new') {
    //change fetching of data
    const data = await fakeProducts.getProductById(Number(reimbursementId));
    reimbursement = data.product as Product;
    if (!reimbursement) {
      notFound();
    }
    pageTitle = `Edit Reimbursement`;
  }

  //change form
  return <ProductForm initialData={reimbursement} pageTitle={pageTitle} />;
}
