using System.Web;
using System.Web.Optimization;

namespace DGSConsole.Agent
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            RegisterJqueryBundles(bundles);

            RegisterModernizrBundles(bundles);

            RegisterCSSBundles(bundles);

            RegisterAngularBundles(bundles);

            RegisterLibBundles(bundles);

            RegisterModulesBundles(bundles);
        }

        private static void RegisterJqueryBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                         "~/Scripts/jquery.validate*",
                         "~/Scripts/jquery.validate.unobtrusive.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jquerycommon").Include(
                      "~/core/libs/jquery-ui/jquery-ui.js",
                      //   "~/core/libs/notify/jquery.toast.js",
                      "~/Scripts/respond.js",
                       "~/Scripts/bootstrap.js"
                      //    "~/Scripts/jquery.tabSlideOut.v1.3.js"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/RSignal").Include(
                   "~/Scripts/jquery.signalR-2.2.1.js",
                    "~/signalr/hubs"
                   ));
        }



        private static void RegisterModernizrBundles(BundleCollection bundles)
        {
            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));
        }

        private static void RegisterAngularBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/app/angular").Include(
                      "~/core/libs/angular/angular.js",
                      "~/core/libs/angular/angular-animate.js"
                      ));
        }

        private static void RegisterCSSBundles(BundleCollection bundles)
        {////
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/bootstrap.css",

            "~/Content/Custom.min.css",
                     "~/Content/site.css"
                      ));
        }

        private static void RegisterLibBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/app/libs").Include(
                    "~/core/libs/smart-table/smart-table.js",
                     //  "~/core/libs/smart-table/sortable.js",
                     //  "~/core/libs/htmlcanvas/html2canvas.js",
                     "~/core/libs/smart-table/dirPagination.js"
            //   "~/core/libs/Lodash/lodash.js",
            //  "~/core/libs/seleci/seleci.js",
            //  "~/core/libs/seleci/ng-seleci.js",
            // "~/core/libs/moment/moment.js",
            //  "~/core/libs/daterangepicker/daterangepicker.js",
            //  "~/core/libs/notify/waitingDialog.js",
            //  "~/core/libs/fileupload/ng-file-upload-all.js"
            ));
        }
        private static void RegisterModulesBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/app/core").Include("~/core/app.js"));
        }
    }
}
