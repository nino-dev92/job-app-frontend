const Footer = () => {
  const today = new Date();
  const year = today.getFullYear();

  return (
    <footer className="bg-slate-50 border-t py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm text-slate-500">
          © {year} TalentHub Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
