﻿using DGSConsole.Agent.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DGSConsole.Agent.Controllers
{
    [RoutePrefix("api/v1")]
    public class ConsoleController : ApiController
    {
        [Route("users")]
        public IHttpActionResult Get()
        {
            try
            {
                var users = AgentDataProvider.Cache.Select(x=>x.Value).ToList();
                return Ok(users);
            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }
        }
        [Route("users/manager")]
        [HttpPost]
        public IHttpActionResult GetUserManagers([FromBody]string emailID)
        {
            try
            {
                if (AgentDataProvider.Cache.ContainsKey(emailID))
                {                 
                    return Ok(from e in AgentDataProvider.GetAllAgentsData()
                              where e.ID == AgentDataProvider.Cache[emailID].Manager
                              select e.Email);
                }
                else return NotFound();               
            }
            catch (Exception ex) { return InternalServerError(ex); }
        }

    }
}
