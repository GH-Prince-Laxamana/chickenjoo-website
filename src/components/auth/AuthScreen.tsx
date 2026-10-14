import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import AuthForm from "./AuthForm";
export default function AuthScreen({ admin = false, register = false, next = "/menu" }: { admin?: boolean; register?: boolean; next?: string }) {
  return <div className={`auth-screen ${admin ? "auth-admin" : "auth-customer"}`}>
    <div className="auth-shell">
      <Link href="/" className="auth-back"><ArrowLeft size={18} aria-hidden="true" /> Back to Chicken Joo</Link>
      <div className="auth-layout">
        <div className="auth-intro">
          <h1>{admin ? "Welcome back, team." : register ? "Your next Joo order starts here." : <><span className="block">Welcome back.</span><span className="block">Let’s eat.</span></>}</h1>
          <p className="auth-description">{admin ? "Your workspace for menus, branches, orders, and news." : "Save your meal picks, enjoy your vouchers, and get ready for pickup."}</p>
          <div className="auth-note"><ShieldCheck size={22} aria-hidden="true" /><p>{admin ? "For authorized Chicken Joo administrators." : "Browse freely. An account is only needed when you start your order."}</p></div>
        </div>
        <section className="auth-card" aria-labelledby="auth-title">
          <p className="auth-eyebrow">{admin ? "TEAM ACCESS" : "CHICKEN JOO ACCOUNT"}</p>
          <h2 id="auth-title">{register ? "Create your account" : "Sign in"}</h2>
          <p className="auth-card-description">{register ? "A few details, then back to your meal." : "Enter your email and password to continue."}</p>
          <AuthForm admin={admin} register={register} next={next} />
          {!admin && <p className="auth-switch">{register ? "Already have an account?" : "New to Chicken Joo?"} <Link href={`${register ? "/login" : "/register"}?next=${encodeURIComponent(next)}`}>{register ? "Sign in" : "Create an account"}</Link></p>}
        </section>
      </div>
    </div>
  </div>;
}
