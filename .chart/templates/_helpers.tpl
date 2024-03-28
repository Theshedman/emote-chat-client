{{/*
Expand the name of the chart.
*/}}
{{- define "emote-chat-client.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "emote-chat-client.fullname" -}}
{{- if .Values.fullNameOverride }}
{{- .Values.fullNameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "emote-chat-client.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "emote-chat-client.labels" -}}
{{ include "emote-chat-client.selectorLabels" . }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "emote-chat-client.selectorLabels" -}}
app: {{ include "emote-chat-client.name" . }}
{{ toYaml .Values.app.labels }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "emote-chat-client.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "emote-chat-client.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
SERVER URL
*/}}
{{- define "server.url" -}}
{{- printf "emote.ajaegbu.co" | quote }}
{{- end }}
{{- define "www.server.url" -}}
{{- printf "www.emote.ajaegbu.co" | quote }}
{{- end }}

{{/*
Create the ConfigMap data base on the app environment
*/}}
{{- define "emote-chat-client.configData" }}
{{ $PATH := (printf "environments/%v/config-map.yaml" .Values.app.env) }}
{{ .Files.Get $PATH }}
{{- end }}
