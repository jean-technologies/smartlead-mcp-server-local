# Smartlead MCP Managed Service - Deployment Guide

This guide provides detailed instructions for deploying the Smartlead MCP Managed Service platform, with various hosting options ranging from simple self-hosted deployments to scalable cloud solutions.

## Deployment Options Overview

| Option | Complexity | Cost | Scalability | Best For |
|--------|------------|------|------------|----------|
| Self-Hosted (Single Server) | Low | $ | Limited | Individual users or small teams |
| Docker Compose | Medium | $ | Medium | Small to medium businesses |
| Kubernetes | High | $$ | High | Large deployments, enterprise |
| Managed Cloud (AWS ECS/EKS) | Medium-High | $$-$$$ | High | Teams wanting less operational overhead |
| Platform-as-a-Service | Low | $$$ | High | Non-technical teams, rapid deployment |

## 1. Self-Hosted Single Server Deployment

### Requirements
- Ubuntu 20.04 LTS or later
- 4GB RAM minimum (8GB recommended)
- 2 CPU cores minimum
- 20GB storage
- Docker and Docker Compose installed

### Installation Steps

1. Clone the repository on your server:
```bash
git clone https://github.com/yourusername/smartlead-mcp-server.git
cd smartlead-mcp-server
```

2. Create a production configuration file:
```bash
cp docker/docker-compose.prod.yml docker-compose.yml
cp .env.example .env
```

3. Edit the `.env` file with your production settings:
```bash
# Use your favorite editor
nano .env

# Set these values at minimum
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_random_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_admin_password
```

4. Build and start the containers:
```bash
docker-compose up -d
```

5. Set up HTTPS with Let's Encrypt (recommended):
```bash
# Install certbot
apt update
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com
```

6. Access the dashboard at `https://yourdomain.com`

### Maintenance

- Update the application:
```bash
git pull
docker-compose down
docker-compose up -d --build
```

- View logs:
```bash
docker-compose logs -f
```

- Database backups:
```bash
docker exec -t smartlead-mcp-db pg_dump -U postgres smartlead > backup.sql
```

## 2. Docker Compose Deployment (Multi-Server)

For larger deployments, you may want to split components across multiple servers.

### Requirements
- Multiple Ubuntu 20.04 LTS servers
- Docker and Docker Compose on all servers
- Private network between servers or VPN
- Load balancer (e.g., Nginx, HAProxy)

### Architecture
```
┌─────────────┐       ┌─────────────┐
│ Load        │  →    │ Dashboard   │
│ Balancer    │  →    │ Container   │
└─────────────┘       └─────────────┘
      ↓
┌─────────────┐       ┌─────────────┐
│ Service     │  →    │ Database    │
│ Core        │       │ Server      │
└─────────────┘       └─────────────┘
      ↓
┌─────────────┐
│ Instance    │
│ Manager     │
└─────────────┘
      ↓
┌─────────────┐       ┌─────────────┐        ┌─────────────┐
│ MCP         │       │ MCP         │   ...  │ MCP         │
│ Instance 1  │       │ Instance 2  │        │ Instance N  │
└─────────────┘       └─────────────┘        └─────────────┘
```

### Installation Steps

1. **Database Server**:
```bash
# Create docker-compose.yml for database
cat > docker-compose.yml << EOL
version: '3.8'
services:
  postgres:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: smartlead
    ports:
      - "5432:5432"
    restart: always
volumes:
  postgres_data:
EOL

# Create .env file
echo "POSTGRES_PASSWORD=your_secure_password" > .env

# Start database
docker-compose up -d
```

2. **Service Core Server**:
```bash
# Clone repository
git clone https://github.com/yourusername/smartlead-mcp-server.git
cd smartlead-mcp-server

# Create docker-compose.yml for service core
cat > docker-compose.yml << EOL
version: '3.8'
services:
  service-core:
    build:
      context: .
      dockerfile: docker/service-core/Dockerfile
    environment:
      NODE_ENV: production
      DB_HOST: your_db_server_ip
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: \${POSTGRES_PASSWORD}
      DB_NAME: smartlead
      JWT_SECRET: \${JWT_SECRET}
    ports:
      - "3000:3000"
    restart: always
EOL

# Create .env file
cat > .env << EOL
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_random_secret_key
EOL

# Start service core
docker-compose up -d
```

3. **Dashboard Server**:
```bash
# Clone repository if not already done
git clone https://github.com/yourusername/smartlead-mcp-server.git
cd smartlead-mcp-server

# Create docker-compose.yml for dashboard
cat > docker-compose.yml << EOL
version: '3.8'
services:
  dashboard:
    build:
      context: .
      dockerfile: docker/dashboard/Dockerfile
    environment:
      REACT_APP_API_URL: https://api.yourdomain.com
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    restart: always
EOL

# Start dashboard
docker-compose up -d
```

4. **Instance Manager Server**:
```bash
# Clone repository if not already done
git clone https://github.com/yourusername/smartlead-mcp-server.git
cd smartlead-mcp-server

# Create docker-compose.yml for instance manager
cat > docker-compose.yml << EOL
version: '3.8'
services:
  instance-manager:
    build:
      context: .
      dockerfile: docker/instance-manager/Dockerfile
    environment:
      NODE_ENV: production
      API_URL: http://your_service_core_ip:3000
      DB_HOST: your_db_server_ip
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: \${POSTGRES_PASSWORD}
      DB_NAME: smartlead
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always
EOL

# Create .env file
echo "POSTGRES_PASSWORD=your_secure_password" > .env

# Start instance manager
docker-compose up -d
```

5. **Load Balancer Setup (Nginx)**:
```bash
# Install Nginx
apt update
apt install -y nginx

# Configure Nginx
cat > /etc/nginx/sites-available/smartlead << EOL
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://your_dashboard_ip;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /api {
        proxy_pass http://your_service_core_ip:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOL

# Enable the site and get SSL certificate
ln -s /etc/nginx/sites-available/smartlead /etc/nginx/sites-enabled/
certbot --nginx -d yourdomain.com
systemctl restart nginx
```

## 3. Kubernetes Deployment

For highly scalable deployments, Kubernetes is recommended.

### Requirements
- Kubernetes cluster (1.19+)
- kubectl configured
- Helm 3
- Docker registry access

### Deployment Steps

1. **Create a namespace**:
```bash
kubectl create namespace smartlead
```

2. **Create secrets**:
```bash
kubectl create secret generic smartlead-secrets \
  --from-literal=postgres-password=your_secure_password \
  --from-literal=jwt-secret=your_random_secret_key \
  --namespace smartlead
```

3. **Deploy PostgreSQL using Helm**:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install smartlead-db bitnami/postgresql \
  --set global.postgresql.auth.postgresPassword=your_secure_password \
  --set global.postgresql.auth.database=smartlead \
  --namespace smartlead
```

4. **Apply Kubernetes manifests**:
```bash
# Clone repository if not already done
git clone https://github.com/yourusername/smartlead-mcp-server.git
cd smartlead-mcp-server

# Apply manifests
kubectl apply -f k8s/service-core.yaml -n smartlead
kubectl apply -f k8s/dashboard.yaml -n smartlead
kubectl apply -f k8s/instance-manager.yaml -n smartlead
kubectl apply -f k8s/ingress.yaml -n smartlead
```

5. **Configure Ingress for SSL**:
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.9.1/cert-manager.yaml

# Create ClusterIssuer
cat > cluster-issuer.yaml << EOL
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your_email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOL

kubectl apply -f cluster-issuer.yaml
```

6. **Update Ingress to use SSL**:
```bash
cat > k8s/ingress-ssl.yaml << EOL
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: smartlead-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: smartlead-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: dashboard
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: service-core
            port:
              number: 3000
EOL

kubectl apply -f k8s/ingress-ssl.yaml -n smartlead
```

## 4. AWS Deployment (ECS/Fargate)

AWS Elastic Container Service (ECS) with Fargate provides a serverless container deployment option.

### Requirements
- AWS Account
- AWS CLI configured
- Docker images in Amazon ECR
- Basic knowledge of AWS services

### Deployment Steps

1. **Set up Amazon ECR repositories**:
```bash
# Create repositories for each component
aws ecr create-repository --repository-name smartlead/dashboard
aws ecr create-repository --repository-name smartlead/service-core
aws ecr create-repository --repository-name smartlead/instance-manager
aws ecr create-repository --repository-name smartlead/mcp-server
```

2. **Build and push Docker images**:
```bash
# Get ECR login
aws ecr get-login-password | docker login --username AWS --password-stdin your_aws_account_id.dkr.ecr.region.amazonaws.com

# Build and push images
docker build -t your_aws_account_id.dkr.ecr.region.amazonaws.com/smartlead/dashboard:latest -f docker/dashboard/Dockerfile .
docker push your_aws_account_id.dkr.ecr.region.amazonaws.com/smartlead/dashboard:latest

docker build -t your_aws_account_id.dkr.ecr.region.amazonaws.com/smartlead/service-core:latest -f docker/service-core/Dockerfile .
docker push your_aws_account_id.dkr.ecr.region.amazonaws.com/smartlead/service-core:latest

docker build -t your_aws_account_id.dkr.ecr.region.amazonaws.com/smartlead/instance-manager:latest -f docker/instance-manager/Dockerfile .
docker push your_aws_account_id.dkr.ecr.region.amazonaws.com/smartlead/instance-manager:latest

docker build -t your_aws_account_id.dkr.ecr.region.amazonaws.com/smartlead/mcp-server:latest -f docker/base/Dockerfile .
docker push your_aws_account_id.dkr.ecr.region.amazonaws.com/smartlead/mcp-server:latest
```

3. **Create CloudFormation template**:

Create a comprehensive CloudFormation template (`cloudformation.yaml`) that includes:
- VPC and networking
- RDS PostgreSQL instance
- ECS Cluster
- Task definitions for each component
- ECS Services
- Application Load Balancer
- Security groups
- IAM roles

4. **Deploy CloudFormation stack**:
```bash
aws cloudformation create-stack \
  --stack-name smartlead-mcp \
  --template-body file://cloudformation.yaml \
  --parameters ParameterKey=DatabasePassword,ParameterValue=your_secure_password \
  --capabilities CAPABILITY_IAM
```

5. **Configure AWS Secrets Manager**:
```bash
aws secretsmanager create-secret \
  --name smartlead/credentials \
  --secret-string '{"dbPassword":"your_secure_password","jwtSecret":"your_random_secret_key"}'
```

6. **Set up CloudFront for CDN (optional)**:
```bash
aws cloudfront create-distribution \
  --origin-domain-name your-alb-domain.region.elb.amazonaws.com \
  --default-cache-behavior ForwardedValues="{QueryString=true,Cookies={Forward=all}}"
```

## 5. Digital Ocean App Platform

For a simpler deployment option with minimal operational overhead, Digital Ocean App Platform is a good choice.

### Requirements
- Digital Ocean account
- Docker images pushed to Docker Hub or Digital Ocean Container Registry

### Deployment Steps

1. **Push Docker images**:
```bash
# Tag images for Docker Hub
docker tag smartlead-dashboard yourusername/smartlead-dashboard:latest
docker tag smartlead-service-core yourusername/smartlead-service-core:latest
docker tag smartlead-instance-manager yourusername/smartlead-instance-manager:latest

# Push to Docker Hub
docker push yourusername/smartlead-dashboard:latest
docker push yourusername/smartlead-service-core:latest
docker push yourusername/smartlead-instance-manager:latest
```

2. **Create app.yaml for DO App Platform**:
```yaml
name: smartlead-mcp
region: nyc
services:
- name: dashboard
  github:
    repo: yourusername/smartlead-mcp-server
    branch: main
    deploy_on_push: true
  dockerfile_path: docker/dashboard/Dockerfile
  http_port: 80
  routes:
  - path: /

- name: service-core
  github:
    repo: yourusername/smartlead-mcp-server
    branch: main
    deploy_on_push: true
  dockerfile_path: docker/service-core/Dockerfile
  http_port: 3000
  routes:
  - path: /api
  env:
  - key: NODE_ENV
    value: production
  - key: DB_HOST
    value: ${db.HOSTNAME}
  - key: DB_PORT
    value: ${db.PORT}
  - key: DB_USER
    value: ${db.USERNAME}
  - key: DB_PASSWORD
    value: ${db.PASSWORD}
  - key: DB_NAME
    value: ${db.DATABASE}

databases:
- name: db
  engine: pg
  version: 14
  size: basic-xs
```

3. **Deploy using doctl**:
```bash
doctl apps create --spec app.yaml
```

## 6. Managed Kubernetes Services

Several cloud providers offer managed Kubernetes services that are ideal for production deployments:

### Google Kubernetes Engine (GKE)

1. **Create GKE cluster**:
```bash
gcloud container clusters create smartlead-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type e2-standard-2
```

2. **Configure kubectl**:
```bash
gcloud container clusters get-credentials smartlead-cluster --zone us-central1-a
```

3. **Deploy components** (follow Kubernetes deployment steps above)

### Azure Kubernetes Service (AKS)

1. **Create AKS cluster**:
```bash
az group create --name smartlead-rg --location eastus
az aks create --resource-group smartlead-rg --name smartlead-cluster --node-count 3 --enable-addons monitoring
```

2. **Configure kubectl**:
```bash
az aks get-credentials --resource-group smartlead-rg --name smartlead-cluster
```

3. **Deploy components** (follow Kubernetes deployment steps above)

## Recommended Hosting Option for Your Use Case

Based on your requirements for simplicity and scalability, here's our recommendation:

### For Individual Users or Small Teams

**Recommendation**: Digital Ocean App Platform

**Why**:
- Simple deployment with minimal DevOps knowledge required
- Cost-effective for small scale usage
- Managed database and automatic scaling
- Easy to set up SSL and custom domains
- Built-in CI/CD with GitHub integration

**Estimated Monthly Cost**:
- Basic App: $12-25/month
- Database: $15/month
- Total: ~$30-40/month

### For Growing Businesses

**Recommendation**: AWS ECS with Fargate

**Why**:
- Serverless container platform (no server management)
- Highly scalable and reliable
- Integrates well with other AWS services
- Good balance of control vs. managed services
- Suitable for growing from small to large scale

**Estimated Monthly Cost**:
- Fargate services: $50-100/month
- RDS database: $30-60/month
- Load balancer: $20/month
- Total: ~$100-180/month

### For Enterprise-scale Deployment

**Recommendation**: Kubernetes on GKE

**Why**:
- Best-in-class Kubernetes implementation
- Excellent auto-scaling capabilities
- Strong security controls
- Global distribution options
- Advanced monitoring and observability

**Estimated Monthly Cost**:
- GKE cluster: $150-300/month
- CloudSQL: $100-200/month
- Load balancer & networking: $50/month
- Total: ~$300-550/month

## Monitoring and Maintenance

Regardless of deployment option, implement these best practices:

### Monitoring

1. **Set up application monitoring**:
   - Implement Prometheus for metrics collection
   - Use Grafana for visualization
   - Set up alerts for service disruptions

2. **Log management**:
   - Implement ELK Stack (Elasticsearch, Logstash, Kibana) or Cloud provider logging
   - Set up log rotation
   - Create saved queries for common issues

### Backups

1. **Database backups**:
   - Daily automated backups
   - Test restore procedures regularly
   - Implement point-in-time recovery

2. **Configuration backups**:
   - Store configuration in version control
   - Create backup of environment variables
   - Document recovery procedures

### Updates

1. **Regular updates**:
   - Implement CI/CD pipeline for automated updates
   - Schedule maintenance windows
   - Use blue-green deployment for zero downtime updates

## Security Considerations

1. **API Security**:
   - Implement rate limiting
   - Use HTTPS everywhere
   - Validate all inputs
   - Implement proper authentication and authorization

2. **Container Security**:
   - Scan container images for vulnerabilities
   - Use minimal base images
   - Run containers as non-root users
   - Implement least privilege principle

3. **Network Security**:
   - Implement proper network isolation
   - Use private networks where possible
   - Configure security groups and firewalls
   - Implement Web Application Firewall (WAF) for public endpoints 