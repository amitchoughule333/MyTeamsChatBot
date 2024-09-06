using DinkToPdf.Contracts;
using DinkToPdf;
using MyTeamsChatBot;
using MyTeamsChatBot.BL;
using MyTeamsChatBot.Components;
using MyTeamsChatBot.Interop.TeamsSDK;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IChatBot, ChatBot>();

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var config = builder.Configuration.Get<ConfigOptions>();
builder.Services.AddTeamsFx(config.TeamsFx.Authentication);
builder.Services.AddScoped<MicrosoftTeams>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.WithOrigins("*")
                            .AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                      });
});

builder.Services.AddSingleton<ChatService>();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    // Set session timeout (optional, adjust as needed)
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});


// Register IHttpClientFactory
builder.Services.AddHttpClient();

builder.Services.AddSingleton<IConverter>(provider =>
{
    var pdfTools = new PdfTools();
    return new SynchronizedConverter(pdfTools);
});

builder.Services.AddControllersWithViews();
builder.Services.AddControllers();
builder.Services.AddHttpClient("WebClient", client => client.Timeout = TimeSpan.FromSeconds(600));
builder.Services.AddHttpContextAccessor();
builder.Services.AddAntiforgery(o => o.SuppressXFrameOptionsHeader = true);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();

app.UseRouting();
app.UseAntiforgery();
app.UseAuthentication();
app.UseAuthorization();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.UseSession();
//Map MVC routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();