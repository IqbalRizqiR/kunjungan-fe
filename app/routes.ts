import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/admin", "routes/admin/dashboard/Admin.tsx"),
    route("/admin/sessions", "routes/admin/session/Admin.tsx"),
    route("/admin/settings", "routes/admin/visitSetting/Admin.tsx"),
    route("/admin/events", "routes/admin/events/Admin.tsx"),
    route("/admin/visits", "routes/admin/visitor/Admin.tsx"),
    route("/admin/institutions", "routes/admin/institusi/Admin.tsx"),
    route("/admin/packages", "routes/admin/paket/Admin.tsx"),
    route("/login", "routes/auth/Login.tsx"),
    // route("/admin/visits/:visitId", "routes/admin/visits/VisitDetails.tsx"),
    // route("/admin/sessions/:sessionId", "routes/admin/session/SessionDetails.tsx"),
    // route("/admin/events/:eventId", "routes/admin/events/EventDetails.tsx"),
] satisfies RouteConfig;
