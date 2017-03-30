using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DGSConsole.Agent.Models
{
    public class AgentLeg
    {
        public AgentLeg()
        {
            ConnectionIds = new List<string>();
        }
        public string Name { get; set; }
        public string Status { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public List<string> ConnectionIds { get; set; }
    }
}