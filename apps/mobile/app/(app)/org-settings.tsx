import type { InviteCodeDto } from "@/api/generated/arenaAPI.schemas";
import { get as getOrgApi } from "@/api/generated/조직/조직";
import { useOrgStore } from "@/stores/useOrgStore";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
const jwt = {} as any;

export default function OrgSettingsScreen() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const setCurrentOrg = useOrgStore((s) => s.setCurrentOrg);
  const [name, setName] = useState(currentOrg?.name ?? "");
  const [description, setDescription] = useState(currentOrg?.description ?? "");
  const [saving, setSaving] = useState(false);

  const [inviteCodes, setInviteCodes] = useState<InviteCodeDto[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);

  const fetchInviteCodes = useCallback(async () => {
    if (!currentOrg?.orgId) return;
    try {
      const { getInviteCodes } = getOrgApi();
      const result = await getInviteCodes(currentOrg.orgId, { jwt });
      setInviteCodes(result.data ?? []);
    } catch {
      // TODO: 에러 처리
    } finally {
      setLoadingCodes(false);
    }
  }, [currentOrg?.orgId]);

  useEffect(() => {
    fetchInviteCodes();
  }, [fetchInviteCodes]);

  const handleSave = async () => {
    if (!currentOrg?.orgId) return;
    setSaving(true);
    try {
      const { updateOrg } = getOrgApi();
      const result = await updateOrg(
        currentOrg.orgId,
        { name: name.trim(), description: description.trim() },
        { jwt }
      );
      if (result.data) {
        setCurrentOrg(result.data);
        Alert.alert("완료", "조직 정보가 수정되었습니다.");
      }
    } catch {
      Alert.alert("오류", "수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateInviteCode = async () => {
    if (!currentOrg?.orgId) return;
    try {
      const { createInviteCode } = getOrgApi();
      const result = await createInviteCode(currentOrg.orgId, { jwt });
      if (result.data) {
        setInviteCodes((prev) => [...prev, result.data!]);
      }
    } catch {
      Alert.alert("오류", "초대 코드 생성에 실패했습니다.");
    }
  };

  const handleDeleteInviteCode = (code: InviteCodeDto) => {
    Alert.alert("초대 코드 삭제", `${code.code}를 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const { deleteInviteCode } = getOrgApi();
            await deleteInviteCode(
              currentOrg!.orgId!,
              code.inviteCodeId!,
              { jwt }
            );
            setInviteCodes((prev) =>
              prev.filter((c) => c.inviteCodeId !== code.inviteCodeId)
            );
          } catch {
            Alert.alert("오류", "삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleCopyCode = (code: string) => {
    Alert.alert("초대 코드", code);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Org 정보 수정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>조직 정보</Text>

        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="조직 이름"
          maxLength={50}
        />

        <Text style={styles.label}>설명</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="조직 설명 (선택)"
          multiline
          numberOfLines={3}
        />

        <Pressable
          style={[styles.primaryBtn, saving && styles.disabledBtn]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.primaryBtnText}>저장</Text>
          )}
        </Pressable>
      </View>

      {/* 초대 코드 관리 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>초대 코드</Text>
          <Pressable onPress={handleCreateInviteCode}>
            <Text style={styles.addBtn}>생성</Text>
          </Pressable>
        </View>

        {loadingCodes ? (
          <ActivityIndicator
            style={styles.codeLoader}
            size="small"
            color="#0a7ea4"
          />
        ) : inviteCodes.length === 0 ? (
          <Text style={styles.emptyText}>초대 코드가 없습니다</Text>
        ) : (
          inviteCodes.map((code) => (
            <View key={code.inviteCodeId} style={styles.codeRow}>
              <Pressable
                style={styles.codeContent}
                onPress={() => handleCopyCode(code.code!)}
              >
                <Text style={styles.codeText}>{code.code}</Text>
                <Text style={styles.codeDate}>
                  {code.createdAt
                    ? new Date(code.createdAt).toLocaleDateString()
                    : ""}
                </Text>
              </Pressable>
              <Pressable onPress={() => handleDeleteInviteCode(code)}>
                <Text style={styles.deleteBtn}>삭제</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 8,
    borderBottomColor: "#F1F3F5",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#687076",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6E8EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#11181C",
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  primaryBtn: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addBtn: {
    fontSize: 15,
    color: "#0a7ea4",
    fontWeight: "600",
  },
  codeLoader: {
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#687076",
    textAlign: "center",
    padding: 20,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E8EB",
  },
  codeContent: {
    flex: 1,
  },
  codeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#11181C",
    fontFamily: "monospace",
  },
  codeDate: {
    fontSize: 12,
    color: "#9BA1A6",
    marginTop: 2,
  },
  deleteBtn: {
    fontSize: 14,
    color: "#E5484D",
    paddingLeft: 12,
  },
});
