from dishka import Provider, Scope, provide, from_context

from app.setup.config.database import PostgresSettings, SqlaEngineSettings
from app.setup.config.logs  import LoggingSettings
from app.setup.config.security import SecuritySettings
from app.setup.config.settings import AppSettings

class SettingsProvider(Provider):
    scope = Scope.APP

    setting = from_context(AppSettings)

    @provide
    def postgres(self, settings: AppSettings) -> PostgresSettings:
        return settings.postgres

    @provide
    def sqla_engine(self, settings: AppSettings) -> SqlaEngineSettings:
        return settings.sqla

    @provide
    def security(self, settings: AppSettings) -> SecuritySettings:
        return settings.security
    
    @provide
    def log(self, settings: AppSettings) -> LoggingSettings:
        return settings.logs