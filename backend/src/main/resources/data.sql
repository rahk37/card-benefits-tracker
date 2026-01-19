insert into credit_cards (id, name, issuer, network, annual_fee_cents, is_business, description)
values
    (1, 'Chase Sapphire Preferred', 'Chase', 'Visa', 9500, false, 'Flexible travel rewards with strong transfer partners.'),
    (2, 'American Express Gold Card', 'American Express', 'Amex', 25000, false, 'Dining and grocery rewards with monthly credits.'),
    (3, 'Capital One Venture X', 'Capital One', 'Visa', 39500, false, 'Premium travel benefits with easy miles earning.');

insert into reward_categories (card_id, name, earn_rate, details)
values
    (1, 'Travel', '2x points', 'Includes airfare, hotels, transit, and rideshare.'),
    (1, 'Dining', '3x points', 'Dining worldwide including delivery services.'),
    (2, 'Dining', '4x points', 'Restaurants and takeout worldwide.'),
    (2, 'Groceries', '4x points', 'U.S. supermarkets up to issuer cap.'),
    (3, 'Travel', '5x miles', 'Flights booked through Capital One Travel.'),
    (3, 'Hotels & Rentals', '10x miles', 'Hotels and car rentals through Capital One Travel.');

insert into benefits (card_id, type, name, description, value_cents, value_text)
values
    (1, 'CREDIT', 'Anniversary hotel credit', 'Annual hotel credit when booking eligible stays.', 5000, '$50'),
    (1, 'PROTECTION', 'Trip cancellation coverage', 'Coverage for prepaid, non-refundable travel expenses.', null, 'Coverage limits apply'),
    (1, 'PERK', 'DoorDash DashPass', 'Complimentary DashPass membership for eligible period.', null, 'Activation required'),
    (2, 'CREDIT', 'Dining credit', 'Monthly dining credit at select partners.', 12000, '$10/month'),
    (2, 'CREDIT', 'Uber Cash', 'Monthly Uber Cash for rides and Uber Eats.', 12000, '$10/month'),
    (2, 'PERK', 'Hotel Collection benefits', 'Eligible hotel collection booking perks.', null, 'Varies by property'),
    (3, 'CREDIT', 'Annual travel credit', 'Credit for bookings through Capital One Travel.', 30000, '$300'),
    (3, 'PERK', 'Lounge access', 'Unlimited lounge access for cardholders.', null, 'Priority Pass and partner lounges'),
    (3, 'PROTECTION', 'Cell phone protection', 'Coverage for theft or damage.', null, 'Up to coverage limits');
