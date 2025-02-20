export async function submitForm(_prevState: any, _formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { message: 'Form submitted successfully!' };
}
