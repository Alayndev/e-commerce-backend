const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(user: string, code: number) {
  const msg = {
    to: user, // Change to your recipient
    from: "saezalayn@gmail.com", // Change to your verified sender
    subject: `Código: ${code}`,
    text: `El código que debes ingresar es: ${code}`,
  };

  const sentEmail = await sgMail
    .send(msg)
    .then(() => {
      console.log(`Email sent to: ${user}`);
      const sendgridEmail = `Email sent to: ${user}`;
      return { sendgridEmail };
    })
    .catch((error) => {
      console.error(error);
      return { error };
    });

  return sentEmail;
}

export async function sendPaymentConfirmation(user: string) {
  const msg = {
    to: user, // Change to your recipient
    from: "saezalayn@gmail.com", // Change to your verified sender
    subject: `Successful payment.`,
    text: `Your payment has been successful!`,
  };

  const sentEmail = await sgMail
    .send(msg)
    .then(() => {
      console.log(`Email sent to: ${user}`);
      const sendgridEmail = `Email sent to: ${user}`;
      return { sendgridEmail };
    })
    .catch((error) => {
      console.error(error);
      return { error };
    });

  return sentEmail;
}
