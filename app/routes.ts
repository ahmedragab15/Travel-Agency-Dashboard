import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/root/SignIn.tsx"),
  route("api/create-trip", "routes/api/create-trip.ts"),

  layout("routes/admin/AdminLayout.tsx", [
    route("dashboard", "routes/admin/Dashboard.tsx"),
    route("all-users", "routes/admin/AllUsers.tsx"),
    route("trips", "routes/admin/Trips.tsx"),
    route("trips/create", "routes/admin/CreateTrip.tsx"),
    route("trips/:tripId", "routes/admin/TripDetails.tsx"),
  ]),

  layout("routes/root/PageLayout.tsx", [
    index("routes/root/TravelPage.tsx"),
    route("/travel/:tripId", "routes/root/TravelDetails.tsx"),
    route("/travel/:tripId/success", "routes/root/PaymentSuccess.tsx"),
  ]),

  route("*", "routes/PageNotFound.tsx"),
] satisfies RouteConfig;
