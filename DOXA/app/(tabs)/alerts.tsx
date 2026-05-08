import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type NotificationType = "upvote" | "comment" | "mention" | "follow";

interface Notification {
  id: string;
  type: NotificationType;
  actorName: string;
  content: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "upvote",
    actorName: "Carlos Silva",
    content: "deu upvote no seu post 'Como vender drogas online'.",
    time: "2m",
    isRead: false,
  },
  {
    id: "2",
    type: "comment",
    actorName: "Ana Paula",
    content: "comentou: 'Me salvou muito, valeu!!'",
    time: "1h",
    isRead: false,
  },
  {
    id: "3",
    type: "mention",
    actorName: "João Pedro",
    content: "mencionou você em 'Projeto de Extensão - Vagas abertas'.",
    time: "3h",
    isRead: true,
  },
  {
    id: "4",
    type: "follow",
    actorName: "Mariana",
    content: "começou a seguir você.",
    time: "1d",
    isRead: true,
  },
  {
    id: "5",
    type: "upvote",
    actorName: "Pedro",
    content: "deu upvote no seu comentário em 'vendo projetos de pdm 100 reais e bem feito, chama pv'.",
    time: "2d",
    isRead: true,
  },
  {
    id: "6",
    type: "comment",
    actorName: "Theo",
    content: "comentou: 'Caixa de marcha baratinha pra quem ta no terceiro período'",
    time: "2d",
    isRead: true,
  },
  {
    id: "7",
    type: "upvote",
    actorName: "Lucas",
    content: "deu upvote no seu comentário em 'não sei'.",
    time: "2d",
    isRead: true,
  },
  {
    id: "8",
    type: "upvote",
    actorName: "Chitãozinho",
    content: "deu upvote no seu comentário em 'Colocaram uma pedra atras do pneu do carro de roberto la no estacionamento'.",
    time: "2d",
    isRead: true,
  },
  {
    id: "9",
    type: "upvote",
    actorName: "Osama Bin Laden",
    content: "deu upvote no seu comentário em 'Javascript é de noiado'.",
    time: "2d",
    isRead: true,
  },
  {
    id: "10",
    type: "upvote",
    actorName: "José",
    content: "deu upvote no seu comentário em 'depois de reprovar 2x em mac a gente pega a manha'.",
    time: "2d",
    isRead: true,
  },
];

export default function AlertsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getIconData = (type: NotificationType) => {
    switch (type) {
      case "upvote":
        return { name: "arrow-up-circle", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.1)" };
      case "comment":
        return { name: "chatbubble-ellipses", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)" };
      case "mention":
        return { name: "at-circle", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.1)" };
      case "follow":
        return { name: "person-add", color: "#a855f7", bgColor: "rgba(168, 85, 247, 0.1)" };
      default:
        return { name: "notifications", color: "#a855f7", bgColor: "rgba(168, 85, 247, 0.1)" };
    }
  };

  const renderRightActions = (id: string) => {
    return (
      <RectButton
        style={styles.deleteAction}
        onPress={() => deleteNotification(id)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </RectButton>
    );
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const iconData = getIconData(item.type);

    return (
      <Swipeable
        key={item.id}
        renderRightActions={() => renderRightActions(item.id)}
        overshootRight={false}
        containerStyle={styles.swipeableContainer}
      >
        <TouchableOpacity
          onPress={() => markAsRead(item.id)}
          activeOpacity={0.7}
          style={[
            styles.notificationCard,
            !item.isRead && styles.unreadCard
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: iconData.bgColor }]}>
            <Ionicons name={iconData.name as any} size={24} color={iconData.color} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.notificationText}>
              <Text style={styles.actorName}>{item.actorName} </Text>
              {item.content}
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          {!item.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#050510", "#050510", "#170326"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notificações</Text>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={48} color="#4b5563" />
              <Text style={styles.emptyText}>Nenhuma notificação ainda.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050510",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  listContent: {
    paddingBottom: 120,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.03)",
    backgroundColor: "#050510",
  },
  unreadCard: {
    backgroundColor: "rgba(168, 85, 247, 0.05)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  notificationText: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 20,
  },
  actorName: {
    fontWeight: "bold",
    color: "white",
  },
  timeText: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#a855f7",
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 16,
    marginTop: 15,
  },
  deleteAction: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 25,
    width: 100,
    height: "100%",
  },
  swipeableContainer: {
    backgroundColor: "#050510",
  },
});
