using DGSConsole.Agent.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DGSConsole.Agent.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            var cache = AgentDataProvider.Cache;

            return View();
        }

        [Authorize]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [Authorize]
        public ActionResult Manage()
        {

            return View();
        }
        public ActionResult List()
        {

            return View();
        }
        public ActionResult ChatRoom()
        {
            return View();
        }

    }
}