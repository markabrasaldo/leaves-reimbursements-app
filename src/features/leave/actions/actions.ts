export async function submitForm(prevState: any, formData: FormData) {
  const end_date = formData.get('endDate');
  const start_date = formData.get('startDate');
  const leave_type_id = formData.get('leaveType');

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Form submitted:', { end_date, start_date, leave_type_id });

  return { message: 'Form submitted successfully!' };
}
