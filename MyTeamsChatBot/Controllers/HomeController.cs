using MyTeamsChatBot.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MyTeamsChatBot;
using System.Diagnostics;

namespace MyTeamsChatBot.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ChatService _service;
        private readonly IConfiguration _configuration;
        public readonly string eCFRURL;

        /* AIendpoint_config config = new AIendpoint_config();*/
        public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
        {
            _logger = logger;
            eCFRURL = configuration.GetValue<string>("ecfrURL");
        }
        public IActionResult Index()
        {
            ViewData["eCFRURL"] = eCFRURL;
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
