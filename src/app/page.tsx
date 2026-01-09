import { CopilotChat } from "@copilotkit/react-ui";
import { Container, Title, Center, Stack } from "@mantine/core";

export default function HomePage() {
  return (
    <Container style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Title order={1} ta="center">Welcome!</Title>
      <Stack align="stretch" justify="center" h="100%">
        <CopilotChat />
      </Stack>
    </Container>
  )
}
