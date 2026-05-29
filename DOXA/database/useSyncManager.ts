import { useSQLiteContext } from "expo-sqlite";
import { useState, useCallback, useRef } from "react";
import { SyncService } from "./syncService";
import { Alert } from "react-native";

export interface SyncStatus {
  isSyncing: boolean;
  lastSync: Date | null;
  error: string | null;
  isOnline: boolean;
}

export function useSyncManager() {
  const db = useSQLiteContext();
  const [status, setStatus] = useState<SyncStatus>({
    isSyncing: false,
    lastSync: null,
    error: null,
    isOnline: true,
  });

  const syncServiceRef = useRef<SyncService | null>(null);
  const retryAttemptsRef = useRef(0);
  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY_MS = 2000;

  if (!syncServiceRef.current) {
    syncServiceRef.current = new SyncService(db);
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const pushSync = useCallback(
    async (showNotification = true) => {
      if (status.isSyncing) {
        console.log("Sync já está em andamento");
        return;
      }

      setStatus((prev) => ({ ...prev, isSyncing: true, error: null }));

      try {
        await syncServiceRef.current!.pushSync();

        setStatus((prev) => ({
          ...prev,
          isSyncing: false,
          lastSync: new Date(),
          isOnline: true,
        }));

        if (showNotification) {
          console.log("✅ Dados enviados com sucesso!");
        }

        // Reset retry attempts on success
        retryAttemptsRef.current = 0;
      } catch (error: any) {
        console.error("Erro ao fazer Push Sync:", error);

        if (retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
          retryAttemptsRef.current += 1;
          console.log(
            `⏳ Tentando novamente em ${RETRY_DELAY_MS}ms... (Tentativa ${retryAttemptsRef.current}/${MAX_RETRY_ATTEMPTS})`
          );

          await delay(RETRY_DELAY_MS);
          await pushSync(false); // Retry without notification
        } else {
          const errorMessage =
            error?.message || "Erro ao sincronizar dados para o servidor";

          setStatus((prev) => ({
            ...prev,
            isSyncing: false,
            error: errorMessage,
            isOnline: false,
          }));

          if (showNotification) {
            Alert.alert(
              "Erro de Sincronização",
              "Seus dados foram salvos localmente, mas não puderam ser enviados ao servidor. Tente novamente quando tiver conexão."
            );
          }

          retryAttemptsRef.current = 0;
        }
      }
    },
    [status.isSyncing]
  );

  const pullSync = useCallback(async () => {
    if (status.isSyncing) {
      console.log("Sync já está em andamento");
      return;
    }

    setStatus((prev) => ({ ...prev, isSyncing: true, error: null }));

    try {
      await syncServiceRef.current!.pullSync();

      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSync: new Date(),
        isOnline: true,
      }));

      console.log("✅ Dados recebidos com sucesso!");
      retryAttemptsRef.current = 0;
    } catch (error: any) {
      console.error("Erro ao fazer Pull Sync:", error);

      if (retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
        retryAttemptsRef.current += 1;
        console.log(
          `⏳ Tentando novamente em ${RETRY_DELAY_MS}ms... (Tentativa ${retryAttemptsRef.current}/${MAX_RETRY_ATTEMPTS})`
        );

        await delay(RETRY_DELAY_MS);
        await pullSync(); // Retry
      } else {
        const errorMessage = error?.message || "Erro ao sincronizar dados";

        setStatus((prev) => ({
          ...prev,
          isSyncing: false,
          error: errorMessage,
          isOnline: false,
        }));

        Alert.alert(
          "Erro de Sincronização",
          "Não foi possível atualizar os dados. Tente novamente mais tarde."
        );

        retryAttemptsRef.current = 0;
      }
    }
  }, [status.isSyncing]);

  const fullSync = useCallback(async () => {
    console.log("🔄 Iniciando sincronização completa...");
    await pullSync();
    await pushSync(false);
  }, [pullSync, pushSync]);

  const resetError = useCallback(() => {
    setStatus((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    status,
    pushSync,
    pullSync,
    fullSync,
    resetError,
  };
}

