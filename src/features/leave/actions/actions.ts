export async function submitForm(prevState: any, formData: FormData) {
  const end_date = formData.get('endDate');
  const start_date = formData.get('startDate');
  const leave_type_id = formData.get('leaveType');

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { message: 'Form submitted successfully!' };
}
