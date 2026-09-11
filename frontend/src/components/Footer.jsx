const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} NewsLens NLP Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
