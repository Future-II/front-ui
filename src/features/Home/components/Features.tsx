import {
  WhyChoose,
  PartnersAndStats,
  Benefits,
  Pricing,
  Steps,
  PaymentMethods,
  Testimonials,
} from "./sections";

export default function Features() {
  return (
    <div className="bg-white">
      <WhyChoose />
      <PartnersAndStats />
      <Benefits />
      <Pricing />
      <Steps />
      <PaymentMethods />

      <Testimonials />
    </div>
  );
}
