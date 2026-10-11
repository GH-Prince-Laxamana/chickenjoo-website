import Image from "next/image";

export const metadata = {
  title: "Home",
  description:
    "Preview a student Chicken Joo campaign concept. Menu prices and promotion details are sample content awaiting verification.",
};

const menuItems = [
  {
    name: "Boneless Fried Chicken",
    oldPrice: "₱132.00",
    newPrice: "₱99.00",
    desc: "Our signature boneless chicken, perfectly crispy on the outside and incredibly juicy inside.",
  },
  {
    name: "Chicken with Fries",
    oldPrice: "₱199.00",
    newPrice: "₱149.25",
    desc: "Perfectly fried chicken paired with our golden, crispy shoestring fries.",
  },
  {
    name: "Chicken Joo Combo Meal",
    oldPrice: "₱249.00",
    newPrice: "₱186.75",
    desc: "A hearty combination of chicken, steaming rice, and a refreshing drink.",
  },
];
interface MenuItem {
  name: string;
  oldPrice: string;
  newPrice: string;
  desc: string;
}

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="group flex flex-col rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-black/10">
      <span className="mb-4 inline-flex w-fit items-center rounded-full bg-cj-red/10 px-3 py-1 text-xs font-bold tracking-wide text-cj-red">
        Sample price
      </span>
      <h3 className="font-display text-xl font-bold leading-tight text-cj-navy">
        {item.name}
      </h3>

      {/* Improved Price Content Visualization */}
      <div className="mt-3 flex items-end gap-2.5">
        <span className="text-3xl font-black tracking-tight text-cj-navy">
          {item.newPrice}
        </span>
        <span className="mb-1 text-sm font-medium text-cj-charcoal/40 line-through decoration-1">
          {item.oldPrice}
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-cj-charcoal/70">
        {item.desc}
      </p>

      <button type="button" disabled className="mt-6 min-h-11 w-full cursor-not-allowed rounded-xl bg-cj-navy/10 py-3 text-sm font-semibold text-cj-navy">
        Ordering coming soon
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="bg-cj-cream px-4 py-4 text-center text-sm leading-relaxed text-cj-navy sm:px-8">
        <p className="font-semibold">Student campaign preview — promotion details and prices are unverified.</p>
        <p>Demo pickup ordering. No payment or food preparation takes place.</p>
      </div>

      {/* Hero */}
      <section className="relative flex flex-col">
        <div className="relative h-[360px] w-full sm:h-[500px]">
          <Image
            src="/images/promo-banner-resized.png"
            alt="Student campaign artwork: Got Chicken Cravings? 25% Off. Offer is unverified."
            fill
            className="object-cover object-right sm:object-center"
            preload
          />
          {/* Subtle gradient overlay to make the transition into the page smoother */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Overlapping discount card */}
        <div className="relative z-10 -mt-16 flex justify-center px-4 sm:-mt-20">
          <div className="w-full max-w-md rounded-3xl bg-white px-6 py-8 text-center shadow-xl ring-1 ring-black/5 sm:max-w-lg sm:px-12">
            <div className="mb-3 inline-flex items-center rounded-full bg-cj-red/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cj-red">
              Campaign concept
            </div>
            <h1 className="font-display text-2xl font-black tracking-tight text-cj-navy sm:text-4xl">
              Get 25% OFF <span className="text-cj-red">Every Bite</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-cj-charcoal/80 sm:text-base">
              A sample campaign for the student project. Dates, participating
              branches, prices, and offer terms still need confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* Menu section */}
      <section className="mx-auto flex-1 w-full max-w-6xl px-4 pb-20 pt-16 sm:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-black tracking-tight text-cj-navy sm:text-4xl">
            Sample Menu
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-cj-charcoal/70">
            Sample dishes and prices from the campaign concept. Ordering is not yet available.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {menuItems.map((item) => (
            <MenuItemCard key={item.name} item={item} />
          ))}
        </div>
      </section>

    </div>
  );
}
