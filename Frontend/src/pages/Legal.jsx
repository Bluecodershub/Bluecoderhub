import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/routes';

const content = {
  '/privacy': {
    title: 'Privacy Policy',
    body: 'Bluecoderhub keeps user trust at the center of every product. We collect only the information needed to operate services, respond to requests, and improve product quality.',
  },
  '/terms': {
    title: 'Terms of Service',
    body: 'Use Bluecoderhub products responsibly and lawfully. Product-specific terms may apply as individual platforms launch or enter early access.',
  },
  '/cookies': {
    title: 'Cookie Policy',
    body: 'Bluecoderhub may use essential cookies for security, sessions, analytics, and product experience. You can manage cookie preferences through your browser settings.',
  },
};

export default function Legal() {
  const location = useLocation();
  const page = content[location.pathname] || content['/privacy'];

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <section className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.045] p-6 sm:p-8">
        <p className="text-sm font-bold uppercase text-blue-200/80 mb-3">Bluecoderhub</p>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-normal">
          {page.title}
        </h1>
        <p className="mt-6 text-gray-400 leading-relaxed">{page.body}</p>
        <p className="mt-5 text-sm text-gray-500">
          This is a lightweight public notice for the local site. Replace it with reviewed legal copy before production launch.
        </p>
        <Link to={ROUTES.CONTACT} className="inline-flex mt-8 min-h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-extrabold text-black hover:bg-blue-100 transition-colors">
          Contact Us
        </Link>
      </section>
    </main>
  );
}
