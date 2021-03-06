﻿using System;
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

            return View();
        }

        [Authorize]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        public ActionResult Chat()
        {
            ViewBag.Message = "Chat";

            return View();
        }

        [Authorize]
        public ActionResult Manage()
        {

            return View();
        }

      
        public ActionResult WebPhone()
        {

            return View();
        }

        public ActionResult List()
        {
            string ip = Request.UserHostAddress;
            ViewBag.IpAddress = ip;
            return View();
        }
        public ActionResult ChatRoom()
        {
            return View();
        }

        public ActionResult SceenShare()
        {
            return View();
        }

        public ActionResult CustomShare()
        {
            return View();
        }
    }
}