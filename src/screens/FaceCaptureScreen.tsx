import { useRef, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, WarningCircle } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton } from '../components';
import { colors, radius, spacing, typography } from '../tokens';
import { CameraCaptureButton } from '../patterns/camera';

type Props = {
  onBack: () => void;
  onSubmit: (uri: string) => void;
};

export function FaceCaptureScreen({ onBack, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const picture = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false
      });
      if (picture?.uri) {
        setPreviewUri(picture.uri);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: colors.surfacePageStrong }} />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surfacePageStrong, paddingTop: insets.top, paddingHorizontal: spacing.md, paddingBottom: insets.bottom + spacing.xl }}>
        <View style={{ minHeight: 56, justifyContent: 'center' }}>
          <IconButton type="Ghost" size="MD" icon={ArrowLeft} accessibilityLabel="Go back" onPress={onBack} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xl }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: radius.xxl,
              backgroundColor: colors.surfaceActionSecondarySubtle,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <WarningCircle size={36} color={colors.contentAction} weight="regular" />
          </View>
          <View style={{ gap: spacing.sm }}>
            <Text style={typography.titleSection}>Allow camera access</Text>
            <Text style={[typography.bodyLarge, { color: colors.contentSecondary }]}>
              We need the camera to capture your face photo. You can grant access and continue from here.
            </Text>
          </View>
          <Button kind="Primary" size="LG" label="Enable camera" fullWidth onPress={requestPermission} />
        </View>
      </View>
    );
  }

  if (previewUri) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.contentOnLight }}>
        <View style={{ paddingTop: insets.top, paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
          <View style={{ minHeight: 56, justifyContent: 'center' }}>
            <IconButton type="Ghost" size="MD" icon={ArrowLeft} iconColor={colors.contentOnDark} accessibilityLabel="Go back" onPress={onBack} />
          </View>
        </View>

        <View style={{ flex: 1, paddingHorizontal: spacing.md, gap: spacing.lg }}>
          <Text style={[typography.titleSection, { color: colors.contentOnDark }]}>Preview photo</Text>
          <View
            style={{
              flex: 1,
              borderRadius: radius.xxl,
              overflow: 'hidden',
              backgroundColor: colors.surfacePrimary
            }}
          >
            <Image source={{ uri: previewUri }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingTop: spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
            backgroundColor: colors.contentOnLight
          }}
        >
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Button kind="Tertiary" size="LG" label="Retake" fullWidth onPress={() => setPreviewUri(null)} />
            </View>
            <View style={{ flex: 1.4 }}>
              <Button kind="Primary" size="LG" label="Submit Photo" fullWidth onPress={() => onSubmit(previewUri)} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.contentOnLight }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          inset: 0,
          paddingTop: insets.top,
          paddingHorizontal: spacing.md,
          paddingBottom: insets.bottom + spacing.lg
        }}
      >
        <View style={{ minHeight: 56, justifyContent: 'center' }}>
          <IconButton type="Ghost" size="MD" icon={ArrowLeft} iconColor={colors.contentOnDark} accessibilityLabel="Go back" onPress={onBack} />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: 250,
              height: 320,
              borderRadius: 160,
              borderWidth: 3,
              borderColor: colors.contentOnDark,
              backgroundColor: 'transparent'
            }}
          />
        </View>

        <View style={{ gap: spacing.lg }}>
          <View style={{ gap: spacing.xs, alignItems: 'center' }}>
            <Text style={[typography.titleSubsection, { color: colors.contentOnDark }]}>Align your face inside the guide</Text>
            <Text style={[typography.bodyDefault, { color: colors.contentOnDark, opacity: 0.8, textAlign: 'center' }]}>
              Remove hats, sunglasses, and face masks before capturing your photo.
            </Text>
          </View>

          <CameraCaptureButton onPress={handleCapture} disabled={isCapturing} />
          <Text style={[typography.bodySmall, { color: colors.contentOnDark, opacity: 0.8, textAlign: 'center' }]}>Capture</Text>
        </View>
      </View>
    </View>
  );
}
